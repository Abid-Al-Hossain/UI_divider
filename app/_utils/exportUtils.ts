"use client";

import {
  type DividerContentPosition,
  type DividerOrientation,
  type DividerVariant,
} from "../types";

export type DividerExportInput = {
  downloadName: string;
  orientation: DividerOrientation;
  width: string;
  thickness: number;
  gap: number;
  color: string;
  variant: DividerVariant;
  borderRadius: number;
  showLabel: boolean;
  labelText: string;
  labelPosition: DividerContentPosition;
  labelBackground: string;
  labelColor: string;
  labelPadding: number;
  contentType: "text" | "icon";
  iconName: string;
  iconSize: number;
  fontSize: number;
  fontWeight: string;
  labelTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  letterSpacing: number;
  gradientEnabled: boolean;
  gradientStart: string;
  gradientEnd: string;
  opacity: number;
  animateBeam: boolean;
  beamColor: string;
  beamSpeed: number;
  shimmerEnabled: boolean;
  shimmerSpeed: number;
  neonGlow: boolean;
  glowColor: string;
  glowBlur: number;
  interactiveResize: boolean;
  ariaRole: "separator" | "presentation" | "none";
  ariaLabel: string;
};

export function buildDividerExportPayload(params: DividerExportInput) {
  const {
    downloadName,
    orientation,
    width,
    thickness,
    gap,
    color,
    variant,
    borderRadius,
    showLabel,
    labelText,
    labelPosition,
    labelBackground,
    labelColor,
    labelPadding,
    contentType,
    iconName,
    iconSize,
    fontSize,
    fontWeight,
    labelTransform,
    letterSpacing,
    gradientEnabled,
    gradientStart,
    gradientEnd,
    opacity,
    animateBeam,
    beamColor,
    beamSpeed,
    shimmerEnabled,
    shimmerSpeed,
    neonGlow,
    glowColor,
    glowBlur,
    interactiveResize,
    ariaRole,
    ariaLabel,
  } = params;

  const isHorizontal = orientation === "horizontal";
  const filename = `${downloadName}.tsx`;
  const doubleGap = Math.max(2, thickness);
  const lineAxisThickness =
    variant === "double" ? thickness * 2 + doubleGap : thickness;

  const getSizeStyle = () =>
    isHorizontal
      ? { width, height: `${lineAxisThickness}px` }
      : { width: `${lineAxisThickness}px`, height: width };

  const getLineFill = () =>
    gradientEnabled
      ? `linear-gradient(${isHorizontal ? "to right" : "to bottom"}, ${gradientStart}, ${gradientEnd})`
      : color;

  const getDoubleBackground = () =>
    isHorizontal
      ? `linear-gradient(to bottom, ${getLineFill()} 0 ${thickness}px, transparent ${thickness}px ${thickness + doubleGap}px, ${getLineFill()} ${thickness + doubleGap}px ${thickness * 2 + doubleGap}px)`
      : `linear-gradient(to right, ${getLineFill()} 0 ${thickness}px, transparent ${thickness}px ${thickness + doubleGap}px, ${getLineFill()} ${thickness + doubleGap}px ${thickness * 2 + doubleGap}px)`;

  const reactIconComponentMap: Record<string, string> = {
    star: "Star",
    check: "Check",
    heart: "Heart",
    shield: "Shield",
    zap: "Zap",
    bell: "Bell",
    alert: "AlertCircle",
  };
  const reactIconName = reactIconComponentMap[iconName] ?? "Star";
  const reactIconImport =
    contentType === "icon"
      ? `import { ${reactIconName} } from "lucide-react";\n`
      : "";

  const labelCommonStyle = `padding: '${isHorizontal ? `0 ${labelPadding}px` : `${labelPadding}px 0`}', color: '${labelColor}', background: '${labelBackground}'`;
  const reactLabelContent =
    contentType === "icon"
      ? `<${reactIconName} size={${iconSize}} />`
      : labelText;
  const reactLabelMarkup = showLabel
    ? `<div style={{ ${labelCommonStyle}, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>${contentType === "icon" ? reactLabelContent : `<span style={{ fontSize: '${fontSize}px', fontWeight: '${fontWeight}', textTransform: '${labelTransform}', letterSpacing: '${letterSpacing}px', whiteSpace: 'nowrap' }}>${reactLabelContent}</span>`}</div>`
    : "";

  let bg = color;
  if (variant === "double") {
    bg = getDoubleBackground();
  } else if (gradientEnabled) {
    bg = getLineFill();
  } else if (variant !== "solid") {
    bg = "transparent";
  }

  const getBorderInfo = () => {
    if (variant === "solid" || gradientEnabled || variant === "double") {
      return "";
    }
    if (isHorizontal) {
      return `border-top: ${thickness}px ${variant} ${color}; height: 0;`;
    }
    return `border-left: ${thickness}px ${variant} ${color}; width: 0;`;
  };

  const shadow = neonGlow
    ? `0 0 ${glowBlur}px ${glowColor}, 0 0 ${glowBlur * 2}px ${glowColor}`
    : "none";
  const roleProp =
    ariaRole === "none" ? "" : `\n      role="${ariaRole}"`;
  const ariaLabelProp =
    ariaRole === "separator" && ariaLabel.trim()
      ? `\n      aria-label="${ariaLabel.trim()}"`
      : "";

  const content = `import React from 'react';
${reactIconImport}

export default function Divider() {
  const lineStyle = {
    flex: 1,
    position: 'relative',
    borderRadius: ${borderRadius},
    overflow: 'hidden',
    ${
      variant === "solid" || gradientEnabled || variant === "double"
        ? `background: '${bg}', width: '100%', height: '100%'`
        : getBorderInfo()
            .replace(/;/g, ",")
            .replace(/:/g, ": ")
            .replace(/-([a-z])/g, (m) => m[1].toUpperCase())
    }
  };

  return (
    <div${roleProp}${ariaLabelProp} style={{
      display: 'flex', flexDirection: '${isHorizontal ? "row" : "column"}', alignItems: 'center', justifyContent: 'center',
      width: '${getSizeStyle().width}', height: '${getSizeStyle().height}', margin: '${gap}px', opacity: ${opacity},
      boxShadow: '${shadow}', position: 'relative',
      resize: '${interactiveResize ? (isHorizontal ? "horizontal" : "vertical") : "none"}', overflow: '${interactiveResize ? "auto" : "visible"}'
    }}>
      ${showLabel && labelPosition === "left" ? reactLabelMarkup : ""}

      <div style={lineStyle}>
         ${
           animateBeam
             ? `<div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, ${beamColor}, transparent)',
            animation: 'beam ${beamSpeed}s linear infinite'
         }} />`
             : ""
         }
         ${
           shimmerEnabled
             ? `<div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.18)', animation: 'pulse ${shimmerSpeed}s ease-in-out infinite' }} />`
             : ""
         }
      </div>

      ${showLabel && labelPosition === "center" ? reactLabelMarkup : ""}
      ${
        showLabel && labelPosition === "center"
          ? `<div style={lineStyle}>${animateBeam ? `<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, ${beamColor}, transparent)', animation: 'beam ${beamSpeed}s linear infinite'}} />` : ""}${shimmerEnabled ? `<div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.18)', animation: 'pulse ${shimmerSpeed}s ease-in-out infinite' }} />` : ""}</div>`
          : ""
      }

      ${showLabel && labelPosition === "right" ? reactLabelMarkup : ""}

      <style>{\`@keyframes beam { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }\`}</style>
    </div>
  );
}`;

  return { content, filename };
}
