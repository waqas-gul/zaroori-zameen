// pages/FavoritesPage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFavoriteProperties } from "../services/favoritesService";
import { PropertyCard } from "../components/propertiesshow";
import { HeartOff, Loader } from "lucide-react";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!localStorage.getItem("token")) {
          navigate("/login");
          return;
        }

        const response = await getFavoriteProperties();

        // Correctly access the nested data array
        // const favoritesData = response?.data?.data || [];

        setFavorites(response);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError(err.message || "Failed to fetch favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorite Properties</h1>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-12">
          <HeartOff className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600 mb-4">
            You haven't added any properties to your favorites yet.
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              showFavoriteButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
