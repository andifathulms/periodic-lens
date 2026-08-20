/**
 * Citations, one per field. Invariant 4 — a property without a source does not
 * ship, so every key here is referenced by the build and none may be dropped.
 *
 * Licence position, verified before anything was built on it (working style,
 * M0): the IUPAC atomic weights, the CRC values and the NIST ground levels are
 * cited as published reference data, not redistributed as a database; the USGS
 * Mineral Commodity Summaries is a work of the United States Government and is
 * in the public domain.
 */
import type { Source } from './types'

export const SOURCES = {
  iupacWeights: {
    ref: 'iupac-2021',
    cite: 'IUPAC Commission on Isotopic Abundances and Atomic Weights, "Atomic weights of the elements 2021", Pure Appl. Chem. 94(5), 573 (2022).',
  },
  crc: {
    ref: 'crc-104',
    cite: 'CRC Handbook of Chemistry and Physics, 104th edition (2023).',
  },
  nistIonisation: {
    ref: 'nist-asd',
    cite: 'NIST Atomic Spectra Database, Ionization Energies Data (v5.11).',
  },
  nistLevels: {
    ref: 'nist-levels',
    cite: 'NIST Atomic Spectra Database ground levels; CRC Handbook 104th ed., "Electron Configuration of Neutral Atoms in the Ground State".',
  },
  slater: {
    ref: 'slater-1964',
    cite: 'Slater, J. C., "Atomic Radii in Crystals", J. Chem. Phys. 41, 3199 (1964).',
  },
  johnson: {
    ref: 'johnson-2019',
    cite: 'Johnson, J. A., "Populating the periodic table: Nucleosynthesis of the elements", Science 363, 474 (2019).',
  },
  discovery: {
    ref: 'iupac-discovery',
    cite: 'IUPAC element discovery records; Emsley, J., Nature’s Building Blocks, revised ed. (2011).',
  },
  usgs: {
    ref: 'usgs-mcs-2024',
    cite: 'U.S. Geological Survey, Mineral Commodity Summaries 2024 (January 2024). Public domain.',
  },
  /*
   * The ordering rule itself, cited where it is applied rather than in a
   * footnote block. The app used to say electrons fill "in energy order",
   * which is the result and not a rule a reader could check.
   */
  madelung: {
    ref: 'madelung-1936',
    cite: 'The n+ℓ ordering, generally attributed to E. Madelung, Die mathematischen Hilfsmittel des Physikers, 3rd ed. (1936); also known as the Klechkovsky rule.',
  },
  /*
   * The one derived figure in the product, and it is derived from absence.
   * Invariant 4 still applies: the count is traceable to a stated rule over a
   * stated field list, and each of those fields carries its own citation where
   * a value exists. Where one does not, there is nothing to cite — which is
   * the fact being counted.
   */
  unknownCount: {
    ref: 'derived-unknown-count',
    cite: 'Derived: the number of the seven tracked properties — atomic weight, discovery year, electronegativity, atomic radius, first ionisation energy, melting point, density — for which no published value exists in the sources listed above.',
  },
} as const satisfies Record<string, Source>

export const LICENCES = [
  {
    dataset: 'Atomic weights',
    licence: 'Published reference values, cited (IUPAC 2021 technical report).',
    url: 'https://doi.org/10.1515/pac-2019-0603',
  },
  {
    dataset: 'Electron configurations, ionisation energies',
    licence: 'NIST Atomic Spectra Database — US Government work, public domain.',
    url: 'https://www.nist.gov/pml/atomic-spectra-database',
  },
  {
    dataset: 'Physical properties',
    licence: 'Published reference values, cited (CRC Handbook, 104th ed.).',
    url: 'https://hbcp.chemnetbase.com/',
  },
  {
    dataset: 'Nucleosynthetic origin',
    licence: 'Published figure, cited (Johnson 2019, Science).',
    url: 'https://doi.org/10.1126/science.aau9540',
  },
  {
    dataset: 'Indonesian production share',
    licence: 'USGS Mineral Commodity Summaries 2024 — US Government work, public domain.',
    url: 'https://doi.org/10.3133/mcs2024',
  },
] as const
