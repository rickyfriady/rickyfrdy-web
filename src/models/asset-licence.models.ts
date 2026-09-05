/**
 * A licence record for one illustrated asset.
 *
 * A discriminated union rather than optional fields, because "owner-authored"
 * and "third-party" have genuinely different obligations: the owner's own work
 * needs no attribution but must still be recorded, while third-party art cannot
 * ship without a source, a licence, and the attribution string the licence
 * demands. Optional fields would let a third-party entry omit its attribution
 * and still typecheck — the whole point of the manifest is that it cannot.
 */
export type AssetLicence =
  | {
      /** Path relative to `src/assets/illustrated/`. */
      file: string
      author: 'owner'
    }
  | {
      file: string
      author: string
      /** Where it came from — a URL or a pack name. */
      source: string
      /** SPDX identifier where one exists, otherwise the licence's own name. */
      licence: string
      /** Rendered verbatim on the site. A licence requiring credit gets it. */
      attribution: string
      /** Bytes. Overrides the default ceiling for an asset that earns it. */
      maxBytes?: number
    }
