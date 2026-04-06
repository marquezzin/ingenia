/**
 * MarkdownContent — Renders markdown text with styled typography.
 *
 * Wraps react-markdown with Mantine's TypographyStylesProvider
 * and applies an expand/collapse logic matching the admin view.
 */

import { useState } from "react";
import { Box, Button, Collapse, Group, TypographyStylesProvider } from "@mantine/core";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  /** Raw markdown string to render. */
  content: string;
}

const CONTENT_PREVIEW_HEIGHT = 800;

export function MarkdownContent({ content }: MarkdownContentProps) {
  const [expanded, setExpanded] = useState(false);

  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs" style={{ color: "var(--mantine-color-brand-6)" }}>
          <BookOpen size={20} />
          <span style={{ fontWeight: 600, fontSize: "var(--mantine-font-size-sm)", color: "var(--mantine-color-text)" }}>
            Conteúdo da aula
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
    </>
  );
}


