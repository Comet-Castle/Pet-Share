import { Box, Button, Card, Dialog, DialogProvider, Flex, Grid, LayerProvider, Stack, Text, TextInput } from "@sanity/ui";
import { Search, X } from "lucide-react";
import { createElement, useMemo, useState, type CSSProperties } from "react";
import { set, unset, type StringInputProps } from "sanity";
import { getLucideIcon, getLucideIconLabel, lucideIconRegistry } from "@/lib/icons/lucide-icons";
import type { VisualStringOption } from "@/sanity/schemaTypes/objects/studio-options";

const fieldsetStyle = {
  display: "grid",
  gap: "0.625rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
  marginTop: "0.25rem"
} satisfies CSSProperties;

function getOptions(props: StringInputProps) {
  return ((props.schemaType.options?.list ?? []) as VisualStringOption[]).filter((option) => option?.value);
}

function setStringValue(props: StringInputProps, value: string | undefined) {
  props.onChange(value ? set(value) : unset());
}

const studioBorder = "1px solid var(--card-border-color, color-mix(in srgb, CanvasText 16%, transparent))";
const studioMutedText = "var(--card-muted-fg-color, color-mix(in srgb, currentColor 66%, transparent))";
const studioMutedBackground = "var(--card-muted-bg-color, color-mix(in srgb, currentColor 5%, transparent))";

function optionButtonStyle(option: VisualStringOption, selected: boolean) {
  return {
    alignItems: "flex-start",
    background: option.background ?? "#ffffff",
    border: `2px solid ${selected ? "#ff8b6d" : option.border ?? "#e5e0d8"}`,
    borderRadius: "16px",
    boxShadow: selected ? "0 12px 28px rgba(255, 139, 109, 0.2)" : "0 6px 16px rgba(38, 52, 59, 0.08)",
    color: option.color ?? "#26343b",
    cursor: "pointer",
    display: "grid",
    gap: "0.35rem",
    minHeight: "5.75rem",
    padding: "0.875rem",
    textAlign: "left",
    transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
    width: "100%"
  } satisfies CSSProperties;
}

export function VisualStringOptionsInput(props: StringInputProps) {
  const options = getOptions(props);

  return (
    <div style={fieldsetStyle}>
      {options.map((option) => {
        const selected = props.value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => setStringValue(props, option.value)}
            style={optionButtonStyle(option, selected)}
          >
            <span style={{ alignItems: "center", display: "flex", gap: "0.5rem", fontWeight: 700 }}>
              <span
                aria-hidden="true"
                style={{
                  background: option.border ?? "#ff8b6d",
                  borderRadius: "999px",
                  display: "inline-block",
                  height: "0.8rem",
                  width: "0.8rem"
                }}
              />
              {option.title}
            </span>
            {option.description ? (
              <span style={{ color: "rgba(38, 52, 59, 0.72)", fontSize: "0.8125rem", lineHeight: 1.45 }}>
                {option.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function IconPickerInput(props: StringInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedIcon = getLucideIcon(props.value);
  const SelectedIcon = selectedIcon;
  const selectedLabel = getLucideIconLabel(props.value);
  const filteredIcons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return lucideIconRegistry;
    }

    return lucideIconRegistry.filter((icon) => icon.searchText.includes(normalizedQuery));
  }, [query]);

  function selectIcon(value: string) {
    setStringValue(props, value);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <Stack space={3}>
      <Card border padding={3} radius={2}>
        <Flex align="center" gap={3} justify="space-between">
          <Flex align="center" flex={1} gap={3} style={{ minWidth: 0 }}>
            <Card border muted padding={2} radius={2}>
              <Flex align="center" justify="center" style={{ height: "1.25rem", width: "1.25rem" }}>
                {SelectedIcon ? createElement(SelectedIcon, { "aria-hidden": true, size: 18 }) : <Search aria-hidden="true" size={18} />}
              </Flex>
            </Card>
            <Box flex={1} style={{ minWidth: 0 }}>
              <Stack space={2}>
                <Text textOverflow="ellipsis" weight="semibold">
                  {selectedLabel ?? "No icon selected"}
                </Text>
                <Text muted size={1} textOverflow="ellipsis">
                  {props.value ?? "Choose from the full Lucide icon set."}
                </Text>
              </Stack>
            </Box>
          </Flex>
          <Button mode="ghost" onClick={() => setIsOpen(true)} text="Browse icons" type="button" />
        </Flex>
      </Card>

      {props.value ? (
        <Box>
          <Button mode="bleed" onClick={() => setStringValue(props, undefined)} text="Clear icon" type="button" />
        </Box>
      ) : null}

      {isOpen ? (
        <LayerProvider zOffset={30000}>
          <DialogProvider position="fixed" zOffset={30000}>
            <Dialog
              __unstable_hideCloseButton
              cardRadius={2}
              cardShadow={3}
              id="icon-picker-dialog"
              onClickOutside={() => setIsOpen(false)}
              onClose={() => setIsOpen(false)}
              padding={0}
              position="fixed"
              width={4}
            >
              <Card
                padding={3}
                radius={2}
                style={{
                  display: "grid",
                  gap: "0.75rem",
                  gridTemplateRows: "auto auto minmax(0, 1fr)",
                  height: "min(520px, calc(100vh - 5rem))",
                  overflow: "hidden"
                }}
              >
                  <Flex align="flex-start" gap={3} justify="space-between">
                    <Stack flex={1} space={1} style={{ minWidth: 0 }}>
                      <Text size={2} weight="semibold">
                        Choose an icon
                      </Text>
                      <Text muted size={1}>
                        Search the Lucide icon set. Hover or focus an icon to see its name.
                      </Text>
                    </Stack>
                    <Button
                      aria-label="Close icon picker"
                      icon={X}
                      mode="bleed"
                      onClick={() => setIsOpen(false)}
                      style={{ flexShrink: 0 }}
                      type="button"
                    />
                  </Flex>

                  <Stack space={2}>
                    <Text size={1} weight="semibold">
                      Search icons
                    </Text>
                    <TextInput
                      autoFocus
                      clearButton={Boolean(query)}
                      icon={Search}
                      onClear={() => setQuery("")}
                      value={query}
                      onChange={(event) => setQuery(event.currentTarget.value)}
                      placeholder="Try paw, calendar, shield, home, heart..."
                    />
                  </Stack>

                  <div
                    style={{
                      minHeight: 0,
                      maxHeight: "100%",
                      overflowY: "scroll",
                      paddingRight: "0.25rem",
                      scrollbarGutter: "stable"
                    }}
                  >
                    <Grid columns={[8, 11, 15, 19, 21]} gap={1}>
                      {filteredIcons.map((icon) => {
                        const Icon = getLucideIcon(icon.value);
                        const selected = props.value === icon.value;

                        if (!Icon) {
                          return null;
                        }

                        return (
                          <Card
                            as="button"
                            key={icon.value}
                            aria-label={icon.label}
                            aria-pressed={selected}
                            border
                            muted={!selected}
                            onClick={() => selectIcon(icon.value)}
                            padding={0}
                            pressed={selected}
                            radius={1}
                            style={{
                              alignItems: "center",
                              aspectRatio: "1 / 1",
                              cursor: "pointer",
                              display: "inline-flex",
                              justifyContent: "center",
                              minHeight: "2.25rem",
                              width: "100%"
                            }}
                            title={`${icon.label} (${icon.value})`}
                            tone={selected ? "primary" : "default"}
                            type="button"
                          >
                            {createElement(Icon, { "aria-hidden": true, size: 18 })}
                          </Card>
                        );
                      })}
                    </Grid>
                    {!filteredIcons.length ? (
                      <Box padding={4}>
                        <Text muted>No icons match that search.</Text>
                      </Box>
                    ) : null}
                  </div>
              </Card>
            </Dialog>
          </DialogProvider>
        </LayerProvider>
      ) : null}
    </Stack>
  );
}
