import Icon from "@ant-design/icons";
import "./RegisterModal.scss";

import React, { useState } from "react";
import Colors from "../../constants/color";
import { Modal } from "antd";
import Button from "../Button";
import Text from "../Text";

interface RegisterModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm?: () => Promise<void> | void;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  title = "This action is very dangerous!",
  message = "This action cannot be undone.",
  confirmLabel = "Yes, quit now",
  cancelLabel = "No, stay here",
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsSubmitting(true);
      await onConfirm();
      setIsSubmitting(false);
    }
    onClose();
  };

  return (
    <Modal
      destroyOnClose
      open={open}
      onCancel={onClose}
      closable={false}
      footer={null}
      style={{ zIndex: 9000 }}
      rootClassName="confirmation-modal"
    >
      {isLoading ? (
        "Loading"
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="title-wrapper">
            <h3 className="title">Notification</h3>
            <Icon
              name="close"
              size={20}
              color={Colors.GREY_800}
              className="cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="flex flex-col gap-2 px-3 items-center">
            <Text
              type="title-2"
              className="title text-center"
              style={{ overflowWrap: "anywhere" }}
            >
              {title}
            </Text>
            <div className="sub-title text-center">{message}</div>
          </div>
          <div className="flex gap-3 px-3 py-4 w-full">
            <Button
              onClick={onClose}
              variant="secondary"
              type="outline"
              className="flex-1 cancel-btn"
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              loading={isSubmitting}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RegisterModal;
