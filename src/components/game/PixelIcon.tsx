/**
 * Bitmap icons drawn as crisp SVG rects in currentColor — no emoji, no icon
 * font, so they sit on the same pixel grid as the rest of the UI.
 */
const ICONS = {
  star: ["...#...", "..###..", "#######", ".#####.", "..###..", ".##.##.", "##...##"],
  gem: [".#####.", "##.#.##", "#######", ".##.##.", "..###..", "...#..."],
  mail: ["#######", "##...##", "#.#.#.#", "#..#..#", "#.....#", "#######"],
  person: ["..###..", "..###..", "...#...", ".#####.", "#.###.#", "..#.#..", ".##.##."],
  menu: ["#######", ".......", "#######", ".......", "#######"],
  book: ["######.", "#.....#", "#.###.#", "#.....#", "#.###.#", "#.....#", "######."],
  soundOn: ["...#.....", "..##..#..", "####.#.#.", "####.#.#.", "####.#.#.", "..##..#..", "...#....."],
  soundOff: ["...#.....", "..##.....", "####.#.#.", "####..#..", "####.#.#.", "..##.....", "...#....."],
  close: ["#.....#", ".#...#.", "..#.#..", "...#...", "..#.#..", ".#...#.", "#.....#"],
  door: [".#####.", "#.....#", "#.....#", "#...#.#", "#.....#", "#.....#", "#######"],
  brush: [".....##", "....###", "...###.", "..###..", ".##....", "###....", "##....."],
  gear: ["..#.#..", ".#####.", "##...##", ".#.#.#.", "##...##", ".#####.", "..#.#.."],
  flag: ["#......", "####...", "#####..", "####...", "#......", "#......", "#......"],
  chat: ["#######", "#.....#", "#.#.#.#", "#.....#", "####.##", "...##..", "...#..."],
  crown: ["#..#..#", "##.#.##", "#######", "#.#.#.#", "#######"],
  lock: ["..###..", ".#...#.", ".#...#.", "#######", "###.###", "###.###", "#######"],
  check: ["......#", ".....##", "#...##.", "##.##..", ".###...", "..#...."],
  play: ["#....", "##...", "###..", "####.", "###..", "##...", "#...."],
  map: ["##.##.#", "#.##.##", "#.#..#.", "##.##.#", "#.##.##", "#.#..#."],
} as const;

export type IconName = keyof typeof ICONS;

export function PixelIcon({
  name,
  px = 2,
  className,
  title,
}: {
  name: IconName;
  /** CSS px per icon pixel */
  px?: number;
  className?: string;
  title?: string;
}) {
  const grid = ICONS[name];
  const h = grid.length;
  const w = Math.max(...grid.map((r) => r.length));
  const rects: React.ReactNode[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== "#") {
        x++;
        continue;
      }
      let n = 1;
      while (row[x + n] === "#") n++;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={n} height={1} />);
      x += n;
    }
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * px}
      height={h * px}
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      {rects}
    </svg>
  );
}
