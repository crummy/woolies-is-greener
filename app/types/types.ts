import { z } from "zod";
import { AUProductSchema, NZProductSchema } from "./api";

export type Basket = "value" | "quality" | "luxury";

export type AUProduct = z.infer<typeof AUProductSchema>;
export type NZProduct = z.infer<typeof NZProductSchema>;
