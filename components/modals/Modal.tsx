"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="
        fixed 
        inset-0 
        z-50 
        flex 
        items-center 
        justify-center 
        overflow-y-auto 
        overflow-x-hidden 
        bg-neutral-800/70 
        outline-none
        focus:outline-none
        "
      >
        <div
          className="
          relative 
          mx-auto
          my-6
          h-full
          w-full
          md:h-full
          md:w-4/6  
          lg:h-full
          lg:w-3/6
          xl:w-2/5
          2xl:h-auto
          "
        >
          {/*content*/}
          <div
            className={`
            translate
            h-full
            duration-300
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
          `}
          >
            <div
              className="
              translate
              relative
              flex
              h-full
              w-full 
              flex-col 
              rounded-lg 
              border-0 
              bg-secondary
              shadow-lg 
              outline-none 
              focus:outline-none 
              md:h-auto 
              lg:h-auto
            "
            >
              {/*header*/}
              <div
                className="
                relative 
                flex 
                items-center
                justify-center
                rounded-t
                border-b-[1px]
                p-6
                "
              >
                <Button
                  className="
                  absolute
                    left-9  
                    transition
                    hover:scale-125
                  "
                  onClick={handleClose}
                >
                  <X size={18} />
                </Button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/*body*/}
              <div className="relative flex-auto p-6">{body}</div>
              {/*footer*/}
              <div className="flex flex-col gap-2 p-6">
                <div
                  className="
                    flex 
                    w-full 
                    flex-row 
                    items-center 
                    gap-4
                  "
                >
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      disabled={disabled}
                      onClick={handleSecondaryAction}
                      variant="outline"
                    >
                      {secondaryActionLabel}
                    </Button>
                  )}
                  <Button disabled={disabled} onClick={handleSubmit}>
                    {actionLabel}
                  </Button>
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
