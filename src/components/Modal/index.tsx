import type { CenterPopupProps } from 'antd-mobile';
import { CenterPopup } from 'antd-mobile';
import React from 'react';

export type ModalProps = {
  backgroundImage?: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
} & CenterPopupProps;

const Modal: React.FC<ModalProps> = (props) => {
  const {
    visible,
    // setVisible,
    className,
    backgroundImage,
    children,
    bodyStyle,
    bodyClassName,
  } = props;
  const contentStyle: React.CSSProperties = {
    ...bodyStyle,
    ...(backgroundImage && { backgroundImage: `url(${backgroundImage})` }),
  };
  return (
    <CenterPopup
      visible={visible}
      className={className}
      bodyClassName={bodyClassName}
      // destroyOnClose
      onMaskClick={() => {
        // setVisible(false);
      }}
      maskStyle={{
        zIndex: 10000,
      }}
      style={{
        background: 'transparent',
      }}
      bodyStyle={contentStyle}
    >
      {children}
    </CenterPopup>
  );
};

export default Modal;
