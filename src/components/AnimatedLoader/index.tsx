import React from 'react';

interface WebpOverlayProps {
  webpSrc: string; // .webp图片的路径
  children: React.ReactNode; // 传入的React组件
  width?: string;
  height?: string;
}

const WebpOverlay: React.FC<WebpOverlayProps> = ({
  webpSrc,
  children,
  width = 'auto',
  height = 'auto',
}) => {
  const containerStyles = {
    position: 'relative',
    width,
    height,
    display: 'block', // or 'block', 根据需要调整
  };

  const webpStyles = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2, // 确保.webp动画在上层
  };

  const contentStyles = {
    position: 'relative',
    height: '100%',
    width: '100%',
    zIndex: 1, // 保证这一层位于.webp动动效下层
  };

  return (
    <div style={containerStyles}>
      {/* 下层：传入的组件 */}
      <div style={contentStyles}>{children}</div>
      {/* 上层：.webp动态图 */}
      <img src={webpSrc} alt="Animated overlay" style={webpStyles} />
    </div>
  );
};

export default WebpOverlay;
