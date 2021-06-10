import { Popover, Transition } from "@headlessui/react";
import React from "react";

export const Layout: React.FC<{}> = ({ children }) => {
  return (
    <div className="w-screen h-screen">
      <div className="p-4 pl-6 rounded bg-white shadow absolute top-4 left-4 z-50 flex">
        <div className="text-lg font-bold flex-1">Project GIS</div>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
                ${open ? "" : "text-opacity-90"}
                ml-8 flex justify-center items-center cursor-pointer text-blue-400 hover:text-blue-600 transition focus:outline-none`}
              >
                <div className="">
                  <i className="fas fa-info-circle text-lg " />
                </div>
              </Popover.Button>

              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen max-w-xs px-4 mt-6 transform -translate-x-2.5 -left-28 sm:px-0">
                  <div className="overflow-hidden rounded shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-6 bg-gray-50">
                      <span className="flex items-center mb-2">
                        <span className="font-bold uppercase tracking-widest text-xs text-blue-600">
                          Kelompok
                        </span>
                      </span>
                      <div className="flex">
                        <span className="block text-sm text-gray-500 flex-1">
                          Dea Niar M.
                        </span>
                        <span className="block text-sm text-gray-500">
                          21101710XX
                        </span>
                      </div>
                      <div className="flex">
                        <span className="block text-sm text-gray-500 flex-1">
                          Risky Alamsyah L.
                        </span>
                        <span className="block text-sm text-gray-500">
                          21101710XX
                        </span>
                      </div>
                      <div className="flex mb-6">
                        <span className="block text-sm text-gray-500 flex-1">
                          Angga Pradipta K.P.
                        </span>
                        <span className="block text-sm text-gray-500">
                          2110171048
                        </span>
                      </div>
                      <span className="flex items-center mb-2">
                        <span className="font-bold uppercase tracking-widest text-xs text-blue-600">
                          Dataset Sources
                        </span>
                      </span>
                      <span className="block text-sm text-blue-500 flex-1">
                        <a
                          href="http://www.google.com"
                          target="_blank"
                          rel="noreferrer"
                        >
                          https://www.google.com
                        </a>
                      </span>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      {children}
    </div>
  );
};

export default Layout;
