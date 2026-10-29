import { useCallback, useEffect, useMemo, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Search,
  Shuffle,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import {
  capitalize,
  Country,
  Usernames,
  WishCard,
} from "@/components/wish-card"
import wishes from "@/data/wishes.json"
import "@/styles/Wishes.css"

const WishesSection = () => {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<number | null>(null)

  // Filter wishes based on the search query.
  const filtered = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()

    return wishes
      .map((wish, index) => ({ wish, index }))
      .filter(({ wish }) =>
        Object.values(wish).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm),
        ),
      )
  }, [query])

  // Get the currently selected wish.
  const current =
    selected === null ? null : wishes[selected] ?? null

  // Find the selected wish's position in the filtered results.
  const position = filtered.findIndex(
    (item) => item.index === selected,
  )

  // Navigate between filtered wishes.
  const navigate = useCallback(
    (direction: number) => {
      if (filtered.length === 0) return

      const nextPosition =
        (position + direction + filtered.length) % filtered.length

      setSelected(filtered[nextPosition].index)
    },
    [filtered, position],
  )

  // Support left and right arrow keys while viewing a wish.
  useEffect(() => {
    if (selected === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        navigate(-1)
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        navigate(1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selected, navigate])

  // Select a random wish from the current search results.
  const openRandomWish = () => {
    if (filtered.length === 0) return

    const options = filtered.filter(
      (item) => item.index !== selected,
    )

    const pool = options.length > 0 ? options : filtered
    const randomIndex = Math.floor(Math.random() * pool.length)

    setSelected(pool[randomIndex].index)
  }

  const changeQuery = (value: string) => {
    setQuery(value)
  }

  return (
    <>
      <section
        className="wishes-section"
        aria-label="Birthday wishes"
      >
        <div className="wishes-toolbar">
          <div className="wish-count">
            <Heart />
            <strong>A whole lot of love</strong>
            <span>{wishes.length} birthday wishes</span>
          </div>

          <div className="toolbar-controls">
            <label className="search-field">
              <Search />

              <input
                type="search"
                aria-label="Search wishes"
                placeholder="Find a name, username, or a little wish…"
                value={query}
                onChange={(event) =>
                  changeQuery(event.target.value)
                }
              />

              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Clear search"
                  onClick={() => changeQuery("")}
                >
                  <X />
                </Button>
              )}
            </label>

            <Button
              variant="celebration"
              onClick={openRandomWish}
              disabled={filtered.length === 0}
            >
              <Shuffle />
              Random Message
            </Button>
          </div>
        </div>

        {query && (
          <p className="search-summary" role="status">
            {filtered.length}{" "}
            {filtered.length === 1 ? "wish" : "wishes"} found
          </p>
        )}

        <div className="wishes-grid">
          {filtered.map(({ wish, index }) => (
            <WishCard
              key={index}
              wish={wish}
              index={index}
              onOpen={() => setSelected(index)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-wishes">
            <Search />
            <h2>No wishes found</h2>
            <p>Try another name, username, or word.</p>

            <Button
              variant="outline"
              onClick={() => changeQuery("")}
            >
              Show all wishes
            </Button>
          </div>
        )}
      </section>

      <Dialog.Root
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="viewer-overlay" />

          <Dialog.Content
            className={`message-viewer tone-${(selected ?? 0) % 3}`}
            aria-describedby={
              current ? "opened-message" : undefined
            }
          >
            {current && (
              <>
                <Dialog.Close asChild>
                  <Button
                    variant="round"
                    size="icon"
                    className="viewer-close"
                    aria-label="Close message"
                  >
                    <X />
                  </Button>
                </Dialog.Close>

                <Button
                  variant="round"
                  size="icon"
                  className="viewer-prev"
                  aria-label="Previous message"
                  onClick={() => navigate(-1)}
                  disabled={filtered.length <= 1}
                >
                  <ArrowLeft />
                </Button>

                <Button
                  variant="round"
                  size="icon"
                  className="viewer-next"
                  aria-label="Next message"
                  onClick={() => navigate(1)}
                  disabled={filtered.length <= 1}
                >
                  <ArrowRight />
                </Button>

                <div className="viewer-body" key={selected}>
                  <Dialog.Title className="viewer-title">
                    <span className="sender-label">
                      Message from:
                    </span>
                    <strong>{capitalize(current.name)}</strong>
                  </Dialog.Title>

                  <Country wish={current} />

                  <Dialog.Description
                    id="opened-message"
                    className="viewer-message"
                  >
                    {current.message}
                  </Dialog.Description>

                  <Usernames wish={current} />
                </div>

                <div className="viewer-counter">
                  A LITTLE BIRTHDAY LOVE
                  <span>
                    {position + 1} / {filtered.length}
                  </span>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

export default WishesSection
