import classNames from 'classnames';
import * as React from 'react';

import VedioPlayIcon from '@/assets/videoPlay.png';
import Modal, { ModalProps } from '@/components/Modal';

import styles from './index.less';

export type ICustomModalProps = ModalProps & {
  modalTitle: string;
  modalDesc: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  afterConfirmClose?: boolean;
};
const CustomModal: React.FC<ICustomModalProps> = (props) => {
  const {
    visible,
    setVisible,
    modalTitle,
    modalDesc,
    cancelText = '放弃机会',
    confirmText = '立即解锁',
    onConfirm,
    afterConfirmClose = true,
    onCancel,
  } = props;
  const unLockTopics = async () => {
    onConfirm?.();
    if (afterConfirmClose) {
      setVisible(false);
    }
  };
  const concelHandle = () => {
    onCancel?.();
    setVisible(false);
  };
  return (
    <Modal
      visible={visible}
      setVisible={setVisible}
      bodyClassName={styles.modalBody}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalTitle}>{modalTitle}</div>
        <div className={styles.modalDesc}>{modalDesc}</div>
        <div className={styles.opreateBtns}>
          <div
            onClick={concelHandle}
            className={classNames(styles.oprateBtn, styles.cancelBtn)}
          >
            {cancelText}
          </div>
          <div
            onClick={unLockTopics}
            className={classNames(styles.oprateBtn, styles.unlockBtn)}
          >
            {confirmText} <img src={VedioPlayIcon} alt="解锁视频" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
