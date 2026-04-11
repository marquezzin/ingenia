/**
 * MarkdownContent — Renders markdown text with styled typography.
 *
 * Wraps react-markdown with Mantine's TypographyStylesProvider.
 * When content exceeds CONTENT_PREVIEW_HEIGHT, shows a collapsible
 * preview with a gradient fade. Short content is shown in full.
 *
 * The optional `label` prop controls the header text.
 * Pass `collapsible={false}` to disable the expand/collapse logic entirely.
 */

import { useState, useRef, useEffect } from "react";
import { Box, Button, Collapse, Group, TypographyStylesProvider } from "@mantine/core";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  /** Raw markdown string to render. */
  content: string;
  /** Header label. Defaults to "Conteúdo da aula". Pass `null` to hide the header. */
  label?: string | null;
  /** Whether to enable collapse behavior. Defaults to true. */
  collapsible?: boolean;
}

const CONTENT_PREVIEW_HEIGHT = 600;

export function MarkdownContent({
  content,
  label = "Conteúdo da aula",
  collapsible = true,
}: MarkdownContentProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure content height to decide if collapse is needed
  useEffect(() => {
    if (!collapsible || !contentRef.current) return;
    const height = contentRef.current.scrollHeight;
    setNeedsCollapse(height > CONTENT_PREVIEW_HEIGHT);
  }, [content, collapsible]);

  if (!content || content.trim().length === 0) {
    return null;
  }

  const showCollapse = collapsible && needsCollapse;

  // Simple render without collapse logic
  if (!showCollapse) {
    return (
      <>
        {label && (
          <Group justify="space-between" align="center" mb="md">
            <Group gap="xs" style={{ color: "var(--mantine-color-brand-6)" }}>
              <BookOpen size={20} />
              <span style={{ fontWeight: 600, fontSize: "var(--mantine-font-size-sm)", color: "var(--mantine-color-text)" }}>
                {label}
              </span>
            </Group>
          </Group>
        )}
        <div ref={contentRef}>
          <TypographyStylesProvider>
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </TypographyStylesProvider>
        </div>
      </>
    );
  }

  return (
    <>
      {label && (
        <Group justify="space-between" align="center" mb="md">
          <Group gap="xs" style={{ color: "var(--mantine-color-brand-6)" }}>
            <BookOpen size={20} />
            <span style={{ fontWeight: 600, fontSize: "var(--mantine-font-size-sm)", color: "var(--mantine-color-text)" }}>
              {label}
            </span>
          </Group>
          <Button
            variant="subtle"
            size="compact-sm"
            color="gray"
            rightSection={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Recolher" : "Ver conteúdo completo"}
          </Button>
        </Group>
      )}

      {/* Preview (collapsed) */}
      {!expanded && (
        <Box
          style={{
            position: "relative",
            maxHeight: CONTENT_PREVIEW_HEIGHT,
            overflow: "hidden",
          }}
        >
          <TypographyStylesProvider>
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </TypographyStylesProvider>
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background: "linear-gradient(transparent, var(--mantine-color-body))",
              pointerEvents: "none",
            }}
          />
        </Box>
      )}

      {/* Full content (expanded) */}
      <Collapse in={expanded}>
        <TypographyStylesProvider>
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </TypographyStylesProvider>
      </Collapse>

      {/* Toggle button when label is hidden */}
      {!label && (
        <Button
          variant="subtle"
          size="compact-sm"
          color="gray"
          mt="xs"
          rightSection={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Recolher" : "Ver conteúdo completo"}
        </Button>
      )}
    </>
  );
}
