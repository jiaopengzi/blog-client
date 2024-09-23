// utils/vttParser.ts
export async function parseVTT(
  url: string,
): Promise<Array<{ start: number; end: number; text: string }>> {
  const response = await fetch(url)
  const vttText = await response.text()
  const cues = [] as Array<{ start: number; end: number; text: string }>
  const regex =
    /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\s+([\s\S]*?)(?=\r?\n\r?\n|\r?\n*$)/g
  let match
  while ((match = regex.exec(vttText)) !== null) {
    cues.push({
      start: parseTime(match[1]),
      end: parseTime(match[2]),
      text: match[3].trim(),
    })
  }

  return cues
}

function parseTime(time: string): number {
  const [hours, minutes, seconds] = time.split(':')
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds)
}
