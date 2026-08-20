/**
 * Zod schema for the merged element table.
 *
 * Invariant 4: every element record carries per-field sources, and a property
 * without one does not ship. That is enforced here rather than by convention —
 * the known-value schema has no optional source.
 */
import { z } from 'zod'

export const sourceSchema = z.object({
  ref: z.string().min(1),
  cite: z.string().min(8),
})

const known = <T extends z.ZodTypeAny>(value: T) =>
  z.object({
    type: z.literal('known'),
    value,
    unit: z.string(),
    source: sourceSchema,
  })

const unknown = z.object({ type: z.literal('unknown') })

const propertyNumber = z.discriminatedUnion('type', [known(z.number()), unknown])

export const categorySchema = z.enum([
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'reactive-nonmetal',
  'noble-gas',
  'inner-transition-metal',
])

export const originSchema = z.enum([
  'big-bang',
  'cosmic-ray-fission',
  'dying-low-mass-stars',
  'exploding-massive-stars',
  'exploding-white-dwarfs',
  'merging-neutron-stars',
  'human-made',
])

export const blockSchema = z.enum(['s', 'p', 'd', 'f'])

export const subshellSchema = z.object({
  n: z.number().int().min(1).max(8),
  l: blockSchema,
  electrons: z.number().int().min(0).max(14),
})

export const configurationSchema = z.object({
  notation: z.string().min(3),
  subshells: z.array(subshellSchema).min(1),
  anomalous: z.boolean(),
  source: sourceSchema,
})

/** Invariant 10 — a production figure without an edition and a stage is invalid. */
export const productionSchema = z.object({
  share: z.number().min(0).max(1),
  edition: z.number().int().min(1900).max(2100),
  dataYear: z.number().int().min(1900).max(2100),
  stage: z.enum(['mined', 'refined']),
  commodity: z.string().min(2),
  source: sourceSchema,
})

export const productionStateSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('produced'), production: productionSchema }),
  z.object({ type: z.literal('not-produced') }),
  z.object({ type: z.literal('unknown') }),
])

export const elementSchema = z.object({
  z: z.number().int().min(1).max(118),
  symbol: z.string().min(1).max(3),
  name: z.string().min(3),
  nameId: z.string().min(3),
  mass: propertyNumber,
  category: categorySchema,
  block: blockSchema,
  group: z.number().int().min(0).max(18),
  period: z.number().int().min(1).max(7),
  configuration: configurationSchema,
  origin: originSchema,
  discovery: propertyNumber,
  electronegativity: propertyNumber,
  atomicRadius: propertyNumber,
  ionisationEnergy: propertyNumber,
  meltingPoint: propertyNumber,
  density: propertyNumber,
  production: productionStateSchema,
})

export const tableSchema = z.object({
  generatedFrom: z.array(z.string()).min(3),
  licences: z.array(z.object({ dataset: z.string(), licence: z.string(), url: z.string() })).min(3),
  usgsEdition: z.number().int(),
  elements: z.array(elementSchema).length(118),
})

export type ElementTable = z.infer<typeof tableSchema>
