import { FC } from "react";

type DeviceSelectionModalProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredDevices: string[];
  onSelectDevice: (device: string) => void;
  onClose: () => void;
};

const DeviceSelectionModal: FC<DeviceSelectionModalProps> = ({
  searchTerm,
  setSearchTerm,
  filteredDevices,
  onSelectDevice,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Select Medical Device
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3 -mt-2">
          Selecting a device will help the AI provide more accurate answers.
        </p>

        <input
          type="text"
          placeholder="Enter device name..."
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        <div className="mt-4 overflow-y-auto flex-1">
          {filteredDevices.map((device, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectDevice(device);
                onClose();
              }}
              className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center"
            >
              <span className="flex-1">{device}</span>
              <span className="text-blue-500 text-sm">Select</span>
            </button>
          ))}
          {filteredDevices.length === 0 && (
            <div className="text-gray-500 p-3 text-center">
              No matching devices found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceSelectionModal;