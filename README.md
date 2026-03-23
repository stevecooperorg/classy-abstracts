# Classy Abstracts - Abstract Art Color Palette Generator

A web application that helps artists create beautiful abstract artwork by overlapping colored letters with artist-defined color assignments for all overlaps.

Try it out at [classy-abstracts.pages.dev](https://classy-abstracts.pages.dev/)
## Features

- **Custom Color Configuration**: Specify background, letter, and overlap colors using either color names or hex codes
- **Explicit Overlap Colors**: Define the color for each overlap (e.g., 'ab: pink')
- **Default Color for Undefined Overlaps**: Set a fallback color for any overlap not explicitly defined
- **Real-time Preview**: See your artwork update instantly as you change settings
- **SVG Export**: Download your creations as scalable vector graphics
- **Responsive Design**: Works on desktop and mobile devices with two-column layout that scales to single column on mobile
- **Color Information Display**: See exactly which colors are being used for each region
- **Built-in Help**: Comprehensive help documentation accessible via the help button
- **Color Picker Palette**: Search, preview, and copy from a large palette of named colors

## How to Use

1. **Open the Application**: Simply open `index.html` in your web browser
   - Click the **Help** button in the top-right corner for detailed documentation
2. **Configure Colors**: In the "Color Configuration" textarea, specify your colors using this format:
   ```
   bg: black; a: red; b: white; c: #FFD700; ab: pink; ac: violet; bc: orange; default: gray
   ```
   - `bg` specifies the background color
   - Each letter (a, b, c, etc.) gets its own color
   - Overlaps are specified by concatenating the letters (e.g., `ab` for A+B overlap)
   - Use color names (red, blue, etc.) or hex codes (#FF0000, #00FF00, etc.)
   - `default` sets the color for any overlap not explicitly defined

3. **Adjust Settings**:
   - **Font Size**: Control how large the letters appear
   - **Circle Diameter**: Adjust how much the letters overlap
   - **Canvas Size**: Choose output dimensions

4. **Use the Color Picker Palette**:
   - Below the main controls, you'll find a color picker palette.
   - **Search**: Type in the search box to filter the palette by color name.
   - **Preview**: See a grid of color swatches from the full palette.
   - **Copy**: Click any swatch to copy its color name to the clipboard for easy use in your color config.
   - The palette includes hundreds of named colors, far beyond the basic CSS color names.

5. **Generate Art**: Click "Generate Abstract Art" to create your artwork (or adjust controls for live preview)
6. **Download**: Click "Download SVG" to save your creation

## Supported Colors

The application supports:
- **Named Colors**: A large palette of named colors (searchable in the color picker)
- **Hex Colors**: #FF0000, #00FF00, #0000FF, etc.
- **3-digit Hex**: #F00, #0F0, #00F, etc.

## Examples

### Example 1: Basic Abstract
```
bg: black; a: red; b: yellow; c: blue; ab: orange; ac: violet; bc: green; default: gray
```
Creates red, yellow, and blue letters on a black background with artist-defined colors for each overlap.

### Example 2: Warm Palette
```
bg: #2C1810; a: #FF6B35; b: #F7931E; c: #FFD23F; ab: #FFB347; ac: #FF8C42; bc: #FFD580; default: #888888
```
Uses hex colors for a warm, sunset-inspired palette.

### Example 3: Minimalist
```
bg: white; a: #3A86FF; b: #06FFA5; ab: #7AE7C7; default: #CCCCCC
```
Simple two-letter design with explicit overlap color and a default fallback.

## Technical Details

### Color Assignment
- The application uses the artist's explicit color assignments for all regions, including overlaps.
- If a region's color is not defined, the `default` color is used.

### SVG Generation
- Uses SVG paths for crisp, scalable letter shapes
- Implements proper fill rules for overlapping regions
- Generates clean, downloadable vector graphics

### Letter Support

Currently supports all 26 letters of the alphabet, in upper and lower case, and the digits (A-Z, a-z, 0-9) with custom-designed block letter paths.

## Browser Compatibility

Works in all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Files

- `index.html` - Main application file (complete standalone application)
- `help.html` - Help page with complete documentation
- `README.md` - This file
- `requirements.md` - Project requirements

## Development

The application is built with:
- Pure HTML5, CSS3, and JavaScript (no external dependencies)
- Modern CSS Grid and Flexbox for responsive layout
- SVG for scalable graphics generation
- ES6+ JavaScript features

## Future Enhancements

Potential improvements could include:
- Support for custom fonts
- More letter shapes and symbols
- Advanced layering controls
- Color harmony suggestions
- Batch export functionality
- Animation capabilities

## License

This project is open source and available under the MIT License.