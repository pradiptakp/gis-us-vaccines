import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import ReactDOM from "react-dom";

export const Modal = ({
  open,
  title,
  content,
  buttons,
  onClose,
}: {
  open: boolean;
  title: string;
  content: JSX.Element | JSX.Element[] | string | string[];
  onClose?: () => void;
  buttons: {
    text: string;
    color?: string;
    backgroundColor?: string;
    onClick?: () => void;
  }[];
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const renderModal = () => {
    return (
      <>
        <Transition appear show={isOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => {
              if (onClose) {
                onClose();
              }
              setIsOpen(false);
            }}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl max-h-screen">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">{content}</div>

                  <div className="mt-4">
                    {buttons.map((v) => (
                      <button
                        type="button"
                        className={`inline-flex justify-center px-4 py-2 text-sm font-medium ${
                          v.color ? v.color : "text-blue-900"
                        } ${
                          v.backgroundColor ? v.backgroundColor : "bg-blue-100"
                        } border border-transparent rounded-md hover:bg-${
                          v.backgroundColor?.split("-")[1] || "blue"
                        }-200 focus:outline-none`}
                        onClick={() => {
                          if (v.onClick) {
                            v.onClick();
                          } else if (onClose) {
                            onClose();
                          }
                          setIsOpen(false);
                        }}
                      >
                        {v.text}
                      </button>
                    ))}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  return ReactDOM.createPortal(renderModal(), document.body);
};
