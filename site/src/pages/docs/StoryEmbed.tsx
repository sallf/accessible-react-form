type Props = {
  storyId: string
  height?: number
  title?: string
}

export const StoryEmbed = ({ storyId, height = 320, title }: Props) => {
  const src = `/storybook/iframe.html?id=${storyId}&viewMode=story`
  return (
    <div className="my-6 border border-border rounded-lg overflow-hidden bg-bg">
      <iframe
        src={src}
        title={title ?? `Storybook: ${storyId}`}
        loading="lazy"
        className="w-full block"
        style={{ height }}
      />
      <div className="px-3 py-2 border-t border-border bg-bg-subtle text-xs text-fg-muted flex justify-between items-center">
        <span>Live example</span>
        <a
          href={`/storybook/?path=/story/${storyId}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-fg transition-colors"
        >
          Open in Storybook ↗
        </a>
      </div>
    </div>
  )
}
