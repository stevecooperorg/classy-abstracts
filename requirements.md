I am interested in making an app which helps artists pick a colour palette for an abstract image.

The idea is to take the geometric outline of a small number of letters -- perhaps two to four -- and give
each a specific base colour. the background will also have a base
colour.

These letters will be overlapped, and the artist should be able to specify the color for each possible overlap explicitly. For example, red and white might combine to pink, so the artist can specify 'ab: pink'. The background may also be specified. If an overlap color is not defined, a default color should be used.

The artist should be able to:

- specify a background color
- specify a number of letters and corresponding colors
- specify overlap colors using codes like 'ab: pink' (for A overlapping B)
- specify a default color for undefined overlaps
- use a simple textual specification, such as 'bg: black; a: red; b: white; c: goldenrod; ab: pink; ac: violet; bc: orange; default: gray'
- when config is complete, the app should generate an SVG by taking the letters and overlapping them, then coloring all regions of background, single layer, and multiple layers according to the specified colors
- this app should run in a web browser
- fonts are not especially important. if we only support a single fixed font using block capitals this is acceptable
