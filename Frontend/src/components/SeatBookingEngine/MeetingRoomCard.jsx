import { DoorOpen, MapPin, Building2, Layers } from "lucide-react";

const MeetingRoomCard = ({ room, onBook }) => {
  const isAvailable =
    room.isAvailable === true ||
    room.isAvailable === 1 ||
    room.isAvailable === "1";

  return (
    <div
      className={`p-4 rounded shadow-md border-2 ${
        isAvailable ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
      }`}
    >
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <DoorOpen className="text-blue-600" size={20} />
        Room Code: {room.roomCode}
      </h2>

      <div className="text-sm space-y-1 text-gray-700">
        <p className="flex items-center gap-2">
          <MapPin size={16} /> Location: {room.location}
        </p>
        <p className="flex items-center gap-2">
          <Building2 size={16} /> Building: {room.building}
        </p>
        <p className="flex items-center gap-2">
          <Layers size={16} /> Floor: {room.floor}
        </p>
      </div>

      <button
        onClick={() => onBook(room)}
        disabled={!isAvailable}
        className={`mt-4 w-full py-2 rounded ${
          isAvailable
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
      >
        {isAvailable ? "Book Now" : "Booked"}
      </button>
    </div>
  );
};

export default MeetingRoomCard;
