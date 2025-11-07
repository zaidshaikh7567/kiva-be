import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveSocialHandles, selectActiveSocialHandles } from "../../store/slices/socialHandlesSlice";
import { Share2 } from "lucide-react";
import collection from "../../assets/images/collection-img.avif";
import { FaFacebook, FaInstagram,FaWhatsapp  } from "react-icons/fa";
// Platform icon mapping
const getPlatformIcon = (platform) => {
  const platformLower = platform?.toLowerCase() || '';
  switch (platformLower) {
    case 'instagram':
      return <FaFacebook className="w-5 h-5" />;
    case 'facebook':
      return <FaInstagram className="w-5 h-5" />;
    default:
    // case 'twitter':
    //   return <Twitter className="w-5 h-5" />;
    // case 'linkedin':
    //   return <Linkedin className="w-5 h-5" />;
    // case 'pinterest':
    //   return <Pinterest className="w-5 h-5" />;
    // default:
      return <Share2 className="w-5 h-5" />;
  }
};

const Collection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socialHandles = useSelector(selectActiveSocialHandles);

  useEffect(() => {
    // Fetch active social handles
    dispatch(fetchActiveSocialHandles({ page: 1, limit: 100 }));
  }, [dispatch]);

  return (
    <div className="md:pl-16 lg:pl-32 py-[100px] overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* left section */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left h-full relative z-10 px-4 md:px-0">
          <p className="text-sm uppercase tracking-widest md:text-primary-dark text-primary-dark font-montserrat-medium-500 mb-3">
            COLLECTION
          </p>
          <div className="md:text-[92px] sm:text-6xl text-4xl font-sorts-mill-gloudy leading-none md:text-black text-primary-dark !font-thin">
            Our Youth <br className="md:flex hidden" /> Collection on <br />
            Sale Now<span className="text-primary">.</span>
          </div>
          <div className="mt-[14px] text-[20px] italic font-sorts-mill-gloudy font-extralight text-black-light">
            from <span className="text-primary-dark">$199</span> | shop the{" "}
            <span className="text-primary-dark">limited</span> edition
          </div>

          <p className="mt-[14px] text-[16px] md:text-[20px] font-montserrat-regular-400 text-black-light max-w-[600px] mx-auto md:mx-0">
            This collection was created while thinking about youth and purity.
            Trendy gold chains in bracelets and necklaces look very delicate.
            The entire collection is very light, airy, and is a great fit for
            any occasion.
          </p>
          <button 
            onClick={() => navigate('/discover')} 
            className="w-fit mt-8 px-6 py-3 bg-primary-dark text-white font-medium hover:bg-primary transition mx-auto md:mx-0"
          >
            — Discover the collection
          </button>

          {/* Social Media Links */}
          {/* {socialHandles && socialHandles.length > 0 && (
            <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
              <span className="text-sm font-montserrat-medium-500 text-black-light">Follow us:</span>
              <div className="flex items-center gap-3">
                {socialHandles.map((handle) => (
                  <a
                    key={handle._id || handle.id}
                    href={handle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-primary hover:text-white text-black transition-all duration-300 group"
                    aria-label={`Visit our ${handle.platform} page`}
                    title={handle.platform}
                  >
                    {getPlatformIcon(handle.platform)}
                  </a>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* Right section */}
        <div className="hidden flex-1 h-full relative lg:flex items-center justify-center mt-10 md:mt-0">
          {/* Oval Background behind the image */}
          <div className="absolute w-full h-[250px] sm:w-full sm:h-[300px] md:w-full md:h-[350px] lg:w-full lg:h-[400px] bg-primary-light "></div>

          {/* Image in front */}
          <img
            src={collection}
            alt="collection"
            className="relative z-10 max-w-[80%] h-[600px] sm:max-w-[70%] md:max-w-[500px] lg:max-w-[600px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Collection;
