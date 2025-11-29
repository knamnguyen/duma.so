"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@sassy/ui/utils";

// Recommended colors - darker, more muted tones with high contrast for portraits
// 10 colors to fit in one row without scrollbar
const RECOMMENDED_COLORS = [
  "#FFFFFF", // White
  "#E5E5E5", // Light gray
  "#F4D03F", // Amber/Goldenrod yellow
  "#F39C12", // Darker orange
  "#EC7063", // Muted coral
  "#D7BDE2", // Muted lavender
  "#A9CCE3", // Muted blue
  "#76D7C4", // Teal
  "#7DCEA0", // Muted mint
  // "#F8C471", // Warm beige
];

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  label?: string;
};

export function ColorPicker({
  value,
  onChange,
  label = "Background color",
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(100);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const sanitized = hex.replace("#", "");
    if (sanitized.length !== 6) return { h: 0, s: 0, l: 100 };
    const r = Number.parseInt(sanitized.slice(0, 2), 16) / 255;
    const g = Number.parseInt(sanitized.slice(2, 4), 16) / 255;
    const b = Number.parseInt(sanitized.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Update HSL when value changes
  useEffect(() => {
    const hsl = hexToHsl(value);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSaturationLightnessChange = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const newSaturation = Math.round(x * 100);
    const newLightness = Math.round((1 - y) * 100);

    setSaturation(newSaturation);
    setLightness(newLightness);
    onChange(hslToHex(hue, newSaturation, newLightness));
  };

  const handleHueChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newHue = Math.round(x * 360);
    setHue(newHue);
    onChange(hslToHex(newHue, saturation, lightness));
  };

  const currentColorHsl = `hsl(${hue}, 100%, 50%)`;

  // Check if current color is in recommended colors
  const isRecommendedColor = RECOMMENDED_COLORS.some(
    (color) => color.toUpperCase() === value.toUpperCase(),
  );

  // Get recommended colors, excluding current color (since it's shown separately)
  const getRecommendedColors = () => {
    return RECOMMENDED_COLORS.filter(
      (color) => color.toUpperCase() !== value.toUpperCase(),
    );
  };

  const recommendedColors = getRecommendedColors();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2">
        {/* Color Spectrum Selector Button */}
        <div className="relative shrink-0" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all",
              "shadow-sm hover:scale-105 hover:shadow-md",
            )}
            aria-label="Open color picker"
          >
            {/* Circular rainbow ring with white center and plus icon */}
            <div className="relative h-10 w-10">
              {/* Rainbow outer ring - full circle with gradient */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    #ff0000 0deg,
                    #ff7f00 45deg,
                    #ffff00 90deg,
                    #00ff00 135deg,
                    #00ffff 180deg,
                    #0000ff 225deg,
                    #4b0082 270deg,
                    #9400d3 315deg,
                    #ff0000 360deg
                  )`,
                }}
              />
              {/* White center circle - creates the ring effect */}
              <div className="absolute inset-[8px] rounded-full bg-white" />
              {/* Black plus icon in center */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3V13M3 8H13"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </button>

          {isOpen && (
            <div className="absolute top-12 left-0 z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
              <div className="space-y-3">
                {/* Saturation/Lightness picker */}
                <div
                  className="relative h-32 w-64 cursor-crosshair rounded-md select-none"
                  style={{
                    background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, ${currentColorHsl}, #fff)`,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const updateColor = (clientX: number, clientY: number) => {
                      const x = Math.max(
                        0,
                        Math.min(1, (clientX - rect.left) / rect.width),
                      );
                      const y = Math.max(
                        0,
                        Math.min(1, (clientY - rect.top) / rect.height),
                      );
                      const newSaturation = Math.round(x * 100);
                      const newLightness = Math.round((1 - y) * 100);
                      setSaturation(newSaturation);
                      setLightness(newLightness);
                      onChange(hslToHex(hue, newSaturation, newLightness));
                    };
                    updateColor(e.clientX, e.clientY);
                    const handleMove = (moveEvent: MouseEvent) => {
                      updateColor(moveEvent.clientX, moveEvent.clientY);
                    };
                    const handleUp = () => {
                      document.removeEventListener("mousemove", handleMove);
                      document.removeEventListener("mouseup", handleUp);
                    };
                    document.addEventListener("mousemove", handleMove);
                    document.addEventListener("mouseup", handleUp);
                  }}
                >
                  <div
                    className="pointer-events-none absolute h-3 w-3 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `${saturation}%`,
                      top: `${100 - lightness}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>

                {/* Hue slider */}
                <div
                  className="relative h-4 w-64 cursor-pointer rounded-md select-none"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const updateHue = (clientX: number) => {
                      const x = Math.max(
                        0,
                        Math.min(1, (clientX - rect.left) / rect.width),
                      );
                      const newHue = Math.round(x * 360);
                      setHue(newHue);
                      onChange(hslToHex(newHue, saturation, lightness));
                    };
                    updateHue(e.clientX);
                    const handleMove = (moveEvent: MouseEvent) => {
                      updateHue(moveEvent.clientX);
                    };
                    const handleUp = () => {
                      document.removeEventListener("mousemove", handleMove);
                      document.removeEventListener("mouseup", handleUp);
                    };
                    document.addEventListener("mousemove", handleMove);
                    document.addEventListener("mouseup", handleUp);
                  }}
                >
                  <div
                    className="pointer-events-none absolute top-0 h-full w-1 rounded-full border border-white shadow-md"
                    style={{
                      left: `${(hue / 360) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>

                {/* Hex input */}
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 shrink-0 rounded border border-gray-300"
                    style={{ backgroundColor: value }}
                  />
                  <input
                    type="text"
                    value={value.toUpperCase()}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(
                        /[^0-9A-F]/gi,
                        "",
                      );
                      if (newValue.length <= 6) {
                        const hex = newValue.startsWith("#")
                          ? newValue
                          : `#${newValue}`;
                        if (hex.length === 7 || hex.length === 4) {
                          onChange(hex);
                        }
                      }
                    }}
                    className="h-8 w-20 rounded border border-gray-300 px-2 font-mono text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Selected Color (always at top) */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "h-10 w-10 shrink-0 rounded-lg border-2 transition-all hover:scale-105",
            "shadow-sm hover:shadow-md",
            isRecommendedColor
              ? "border-purple-600 ring-2 ring-purple-200"
              : "border-gray-300 hover:border-gray-400",
          )}
          style={{ backgroundColor: value }}
          aria-label="Current selected color"
        >
          <span className="sr-only">Current color: {value}</span>
        </button>

        {/* Recommended Colors - Single Row */}
        <div className="flex flex-1 items-center gap-1">
          {recommendedColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={cn(
                "h-10 w-10 shrink-0 rounded-lg border-2 transition-all hover:scale-105",
                "shadow-sm hover:shadow-md",
                "border-gray-300 hover:border-gray-400",
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            >
              <span className="sr-only">{color}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
