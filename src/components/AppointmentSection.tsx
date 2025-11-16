import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, User } from "lucide-react";

const statesData = {
  "Delhi": {
    cities: ["New Delhi", "South Delhi", "North Delhi"],
    hospitals: {
      "New Delhi": ["AIIMS Delhi", "Apollo Hospital", "Max Super Specialty Hospital"],
      "South Delhi": ["Fortis Hospital Vasant Kunj", "BLK Super Specialty Hospital"],
      "North Delhi": ["Max Hospital Shalimar Bagh", "Jaipur Golden Hospital"],
    }
  },
  "Haryana": {
    cities: ["Faridabad", "Gurgaon", "Panipat"],
    hospitals: {
      "Faridabad": ["Fortis Hospital", "Asian Hospital", "QRG Health City"],
      "Gurgaon": ["Medanta The Medicity", "Fortis Memorial Research Institute", "Artemis Hospital"],
      "Panipat": ["Woodland Hospital", "Kalpana Chawla Hospital"],
    }
  },
  "Maharashtra": {
    cities: ["Mumbai", "Pune", "Nagpur"],
    hospitals: {
      "Mumbai": ["Lilavati Hospital", "Hinduja Hospital", "Breach Candy Hospital"],
      "Pune": ["Ruby Hall Clinic", "Sahyadri Hospital", "Columbia Asia Hospital"],
      "Nagpur": ["Wockhardt Hospital", "Kingsway Hospital", "Orange City Hospital"],
    }
  }
};

const specializations = [
  "General Physician",
  "Cardiologist",
  "ENT Specialist",
  "Orthopedic",
  "Dermatologist",
  "Gynecologist",
];

const AppointmentSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    state: "",
    city: "",
    hospital: "",
    specialization: "",
    date: "",
    time: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleStateChange = (value: string) => {
    setFormData({ ...formData, state: value, city: "", hospital: "" });
  };

  const handleCityChange = (value: string) => {
    setFormData({ ...formData, city: value, hospital: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
    toast({
      title: "✅ Appointment Booked!",
      description: "Your appointment has been confirmed successfully.",
    });
  };

  const getCities = () => {
    if (!formData.state) return [];
    return statesData[formData.state as keyof typeof statesData]?.cities || [];
  };

  const getHospitals = () => {
    if (!formData.state || !formData.city) return [];
    const state = statesData[formData.state as keyof typeof statesData];
    return state?.hospitals[formData.city as keyof typeof state.hospitals] || [];
  };

  if (showConfirmation) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-primary mb-2">Appointment Confirmed!</h2>
            <p className="text-muted-foreground">Your appointment details:</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">{formData.name}</p>
                <p className="text-sm text-muted-foreground">{formData.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">{formData.hospital}</p>
                <p className="text-sm text-muted-foreground">{formData.city}, {formData.state}</p>
                <p className="text-sm text-primary mt-1">{formData.specialization}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">{new Date(formData.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p className="text-sm text-muted-foreground">{formData.time}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => window.open(`https://maps.google.com/?q=${formData.hospital},${formData.city}`, '_blank')}
              variant="outline"
              className="flex-1"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            <Button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Book Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">Book Appointment 📅</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>State</Label>
            <Select value={formData.state} onValueChange={handleStateChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(statesData).map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>City</Label>
            <Select value={formData.city} onValueChange={handleCityChange} disabled={!formData.state}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {getCities().map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Hospital</Label>
          <Select 
            value={formData.hospital} 
            onValueChange={(value) => setFormData({ ...formData, hospital: value })}
            disabled={!formData.city}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select hospital" />
            </SelectTrigger>
            <SelectContent>
              {getHospitals().map((hospital) => (
                <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Specialization</Label>
          <Select 
            value={formData.specialization} 
            onValueChange={(value) => setFormData({ ...formData, specialization: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Preferred Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="mt-1"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="time">Preferred Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Book Appointment
        </Button>
      </form>
    </div>
  );
};

export default AppointmentSection;