import { CalendarDays, MapPin, UserCheck, Building, ClipboardCheck } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700">
            Welcome to FlexiSpot 
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book your perfect desk, manage your hybrid work schedule, and stay productive anywhere. Let’s make workspace flexible.
          </p>
          <img
            src="/assets/hero-office.svg"
            alt="workspace"
            className="w-full max-w-xl mx-auto"
          />
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <MapPin className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="text-xl font-semibold text-blue-800">Interactive Seat Map</h3>
            <p className="text-gray-600 mt-2">Visualize and select your desired desk from an interactive floor plan tailored to your location.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <CalendarDays className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="text-xl font-semibold text-green-800">Quick Booking</h3>
            <p className="text-gray-600 mt-2">Book a seat in just a few clicks — anytime, from anywhere. Filter by date, floor or amenities.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <UserCheck className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="text-xl font-semibold text-purple-800">Manage Your Bookings</h3>
            <p className="text-gray-600 mt-2">See your upcoming and past bookings. Modify or cancel in a seamless way.</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Building className="w-10 h-10 text-blue-500" />
              <p className="font-medium text-gray-700">Choose Building</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <MapPin className="w-10 h-10 text-green-500" />
              <p className="font-medium text-gray-700">Select Seat</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CalendarDays className="w-10 h-10 text-yellow-500" />
              <p className="font-medium text-gray-700">Pick a Date</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <ClipboardCheck className="w-10 h-10 text-purple-500" />
              <p className="font-medium text-gray-700">Confirm Booking</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Ready to find your perfect spot?
          </h2>
          <p className="text-gray-600 mt-2">Start booking your desk today and make every workday productive.</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition">
            Book Now
          </button>
        </section>

      
      </div>
    </div>
  );
};

export default Home;
