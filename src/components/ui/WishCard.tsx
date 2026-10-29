import { ArrowUpRight, Music2 } from "lucide-react"
import { SiInstagram } from "@icons-pack/react-simple-icons"
import "@/styles/WishCard.css"
import { Button } from "@/components/ui/Button"

export type Wish = {
  name: string
  message: string
  country?: string | null
  country_code?: string | null
  ig_username?: string | null
  tt_username?: string | null
}

const capitalize = (value: string) => {
  const text = value.trim().toLocaleLowerCase()
  return text.charAt(0).toLocaleUpperCase() + text.slice(1)
}

const regions = new Intl.DisplayNames(["en"], {
  type: "region",
})

const currentCodes: Record<string, string> = {
  BU: "MM",
  DD: "DE",
  FX: "FR",
  TP: "TL",
  UK: "GB",
  YD: "YE",
  ZR: "CD",
}

const countryCodes = new Map<string, string>()

for (let first = 65; first <= 90; first++) {
  for (let second = 65; second <= 90; second++) {
    const rawCode = String.fromCharCode(first, second)
    const code = currentCodes[rawCode] ?? rawCode
    const name = regions.of(code)

    if (
      name &&
      name !== code &&
      !countryCodes.has(name.toLowerCase())
    ) {
      countryCodes.set(name.toLowerCase(), code)
    }
  }
}

for (const [name, code] of Object.entries({
  usa: "US",
  uk: "GB",
  "united states of america": "US",
  "south korea": "KR",
  "north korea": "KP",
  turkey: "TR",
  czechia: "CZ",
})) {
  countryCodes.set(name, code)
}

const specialFlags: Record<string, string> = {
  scotland: "gb-sct",
}

export function Country({ wish }: { wish: Wish }) {
  const country = wish.country?.trim() || wish.country_code?.trim()

  if (!country) return null

  const normalized = country.toLowerCase()

  const code =
    specialFlags[normalized] ??
    countryCodes.get(normalized) ??
    (country.length === 2 &&
    regions.of(country.toUpperCase()) !== country.toUpperCase()
      ? currentCodes[country.toUpperCase()] ??
        country.toUpperCase()
      : undefined)

  const name = capitalize(
    country.length === 2 && code
      ? regions.of(code) || country
      : country
  )

  const flagCode = code?.toLowerCase()

  return (
    <div className="wish-country">
      {flagCode && (
        <img
          className="country-flag"
          src={`https://flagcdn.com/w80/${flagCode}.png`}
          srcSet={`https://flagcdn.com/w40/${flagCode}.png 1x, https://flagcdn.com/w80/${flagCode}.png 2x, https://flagcdn.com/w160/${flagCode}.png 3x`}
          width={21}
          height={15}
          alt={`${name} flag`}
          loading="lazy"
        />
      )}
      <span>{name}</span>
    </div>
  )
}

export function Usernames({ wish }: { wish: Wish }) {
  const instagram = wish.ig_username?.trim()
  const tiktok = wish.tt_username?.trim()

  if (!instagram && !tiktok) return null

  return (
    <div className="usernames">
      {instagram && (
        <span>
          <SiInstagram aria-label="Instagram" />
          {instagram}
        </span>
      )}

      {tiktok && (
        <span>
          <Music2 aria-label="TikTok" />
          {tiktok}
        </span>
      )}
    </div>
  )
}

export function WishCard({
  wish,
  index,
  onOpen,
}: {
  wish: Wish
  index: number
  onOpen: () => void
}) {
  return (
    <Button
      variant="wish"
      className={`wish-card tone-${index % 3} float-${index % 6}`}
      onClick={onOpen}
      aria-label={`Read message from ${wish.name}`}
    >
      <div className="wish-top">
        <span className="sender-heading">
          <span className="sender-label">Message from:</span>
          <strong>{capitalize(wish.name)}</strong>
        </span>

        <ArrowUpRight className="open-arrow" />
      </div>

      <Country wish={wish} />

      <p>{wish.message}</p>

      {(wish.ig_username?.trim() ||
        wish.tt_username?.trim()) && (
        <div className="wish-bottom">
          <Usernames wish={wish} />
        </div>
      )}
    </Button>
  )
}