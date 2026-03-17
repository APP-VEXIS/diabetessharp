import { z } from "zod";
import { nanoid } from "nanoid";
import { router, publicProcedure } from "../trpc/trpc.js";
import { query } from "../db/client.js";
import shared from "shared";
import type { CarpandaLinkKey } from "shared";
import { confirmPayment } from "../services/confirmPayment.js";

const createOrderSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  cognitiveProfile: z.string(),
  symptomSeverity: z.string(),
  familyHistory: z.boolean(),
  quizSessionId: z.string().optional(),
  cognitiveRiskScore: z.number().optional(),
  discountApplied: z.number().optional(),
  origin: z.string().optional(),
  refCode: z.string().optional(),
});

export const funnelRouter = router({
  submitQuiz: publicProcedure
    .input(
      z.object({
        age: z.number(),
        primaryConcern: z.string(),
        symptomSeverity: z.string(),
        familyHistory: z.boolean(),
        currentHabits: z.string(),
        motivationLevel: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const sessionId = nanoid(16);
      const cognitiveRiskScore = Math.min(
        100,
        Math.max(
          1,
          Math.floor(
            30 +
              (input.age - 45) * 0.5 +
              (input.familyHistory ? 15 : 0) +
              (input.symptomSeverity === "diagnosed" ? 20 : input.symptomSeverity === "noticeable" ? 12 : input.symptomSeverity === "frequent" ? 6 : 0) +
              Math.random() * 15
          )
        )
      );
      await query(
        `INSERT INTO quiz_completions ("sessionId", age, "primaryConcern", "symptomSeverity", "familyHistory", "currentHabits", "motivationLevel", "cognitiveRiskScore")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          sessionId,
          input.age,
          input.primaryConcern,
          input.symptomSeverity,
          input.familyHistory ? 1 : 0,
          input.currentHabits,
          input.motivationLevel,
          cognitiveRiskScore,
        ]
      );
      const personalizedMessage =
        cognitiveRiskScore >= 70
          ? "Seu perfil indica benefício significativo com o programa NeuroSharp. Recomendamos começar o mais cedo possível."
          : cognitiveRiskScore >= 40
            ? "Com o protocolo de 90 dias você pode fortalecer sua memória e reduzir fatores de risco."
            : "Manter a mente ativa com exercícios cognitivos é uma das melhores formas de prevenção.";
      return {
        sessionId,
        cognitiveRiskScore,
        personalizedMessage,
        recommendedProgram: "NeuroSharp 90-Day Program",
      };
    }),

  getQuizResult: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const r = await query<{
        cognitiveRiskScore: number;
        primaryConcern: string;
        symptomSeverity: string;
      }>(
        `SELECT "cognitiveRiskScore", "primaryConcern", "symptomSeverity" FROM quiz_completions WHERE "sessionId" = $1`,
        [input.sessionId]
      );
      const row = r.rows[0];
      if (!row) return null;
      return {
        cognitiveRiskScore: row.cognitiveRiskScore,
        personalizedMessage: `Seu score de risco cognitivo é ${row.cognitiveRiskScore}. O programa NeuroSharp foi desenhado para o seu perfil.`,
      };
    }),

  createCarpandaOrder: publicProcedure.input(createOrderSchema).mutation(async ({ input }) => {
    const refCode = input.refCode ?? input.origin ?? null;
    let affiliateId: number | null = null;
    if (refCode) {
      const aff = await query<{ id: number }>(
        `SELECT id FROM affiliates WHERE code = $1 AND status = 'active'`,
        [refCode]
      );
      if (aff.rows[0]) affiliateId = aff.rows[0].id;
    }

    const discountApplied = input.discountApplied ?? 0;
    const amountPaid = discountApplied === 20 ? 2399 : 2999;

    const order = await query<{ id: number }>(
      `INSERT INTO funnel_orders (
        "firstName", "lastName", email, phone, "cognitiveProfile", "symptomSeverity",
        "familyHistory", "quizSessionId", "cognitiveRiskScore", "discountApplied", "amountPaid",
        "affiliateId", "affiliateCode", "refCode"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        input.firstName,
        input.lastName,
        input.email,
        input.phone ?? null,
        input.cognitiveProfile,
        input.symptomSeverity,
        input.familyHistory ? 1 : 0,
        input.quizSessionId ?? null,
        input.cognitiveRiskScore ?? null,
        discountApplied,
        amountPaid,
        affiliateId,
        refCode,
        refCode,
      ]
    );
    const orderId = order.rows[0].id;
    const linkKey: CarpandaLinkKey = discountApplied === 20 ? "mainDiscount" : "main";
    const url = shared.buildCarpandaUrl(linkKey, orderId, input.email, input.firstName, false);
    return { orderId, url };
  }),

  confirmCarpandaPayment: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
        origin: z.string().optional(),
        includeRecipeBump: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await confirmPayment(input.orderId);
      if (!result.ok) return { success: false, email: "", firstName: "", orderId: input.orderId };
      const u = await query<{ email: string; "firstName": string }>(
        `SELECT email, "firstName" FROM funnel_orders WHERE id = $1`,
        [input.orderId]
      );
      const row = u.rows[0];
      if (!row) return { success: false, email: "", firstName: "", orderId: input.orderId };
      return {
        success: true,
        email: row.email,
        firstName: row.firstName,
        orderId: input.orderId,
        credentials: { login: result.login ?? "", password: result.password ?? "" },
      };
    }),

  getCarpandaUpsellUrl: publicProcedure
    .input(z.object({ orderId: z.number(), upsell: z.enum(["upsell1", "upsell2", "upsell3"]) }))
    .query(async ({ input }) => {
      const o = await query<{ email: string; "firstName": string }>(
        `SELECT email, "firstName" FROM funnel_orders WHERE id = $1`,
        [input.orderId]
      );
      const row = o.rows[0];
      if (!row) return { url: shared.CARPANDA_LINKS[input.upsell] };
      const url = shared.buildCarpandaUrl(
        input.upsell as CarpandaLinkKey,
        input.orderId,
        row.email,
        row.firstName,
        false
      );
      return { url };
    }),

  getOrderCredentials: publicProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input }) => {
      const r = await query<{ generatedLogin: string }>(
        `SELECT "generatedLogin" FROM funnel_orders WHERE id = $1 AND status = 'paid'`,
        [input.orderId]
      );
      const row = r.rows[0];
      if (!row?.generatedLogin) return { credentials: null };
      try {
        const cred = JSON.parse(row.generatedLogin) as { email?: string; password?: string };
        return { credentials: { login: cred.email ?? "", password: cred.password ?? "" } };
      } catch {
        return { credentials: null };
      }
    }),

  confirmCarpandaUpsell: publicProcedure
    .input(z.object({ orderId: z.number(), upsell: z.enum(["upsell1", "upsell2", "upsell3"]) }))
    .mutation(async ({ input }) => {
      const col =
        input.upsell === "upsell1"
          ? "upsell1Purchased"
          : input.upsell === "upsell2"
            ? "upsell2Purchased"
            : "upsell3Purchased";
      await query(
        `UPDATE funnel_orders SET "${col}" = 1 WHERE id = $1`,
        [input.orderId]
      );
      return { success: true };
    }),
});
