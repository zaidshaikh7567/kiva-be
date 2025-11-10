import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  Calendar,
  User,
  Phone,
  MessageSquare,
  Filter,
  RotateCcw,
  X,
  Download,
} from "lucide-react";
import {
  fetchContacts,
  deleteContact,
  fetchSingleContact,
  selectContacts,
  selectContactsLoading,
  selectContactsError,
  selectContactsPagination,
  selectCurrentContact,
  clearError,
  setPagination,
} from "../store/slices/contactsSlice";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Pagination from "../components/Pagination";
import CustomDropdown from "../components/CustomDropdown";

const SERVICE_OPTIONS = [
  { value: "all", label: "All Services" },
  { value: "general", label: "General Inquiry" },
  { value: "custom", label: "Custom Design" },
  { value: "repair", label: "Jewelry Repair" },
  { value: "appraisal", label: "Jewelry Appraisal" },
  { value: "consultation", label: "Personal Consultation" },
  { value: "wholesale", label: "Wholesale Inquiry" },
];

const Contacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const loading = useSelector(selectContactsLoading);
  const error = useSelector(selectContactsError);
  const pagination = useSelector(selectContactsPagination);
  const currentContact = useSelector(selectCurrentContact);

  const currentPage = pagination?.currentPage || 1;
  const limit = pagination?.limit || 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchContacts({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchContacts({ page: currentPage, limit }));
  };

  const handlePageChange = (page) => {
    dispatch(setPagination({ currentPage: page }));
    dispatch(fetchContacts({ page, limit }));
  };

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);

    await dispatch(fetchSingleContact(contact._id));
    // setLoading(false);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
    setSelectedContact(null);
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      try {
        const result = await dispatch(deleteContact(contactToDelete._id));
        if (deleteContact.fulfilled.match(result)) {
          setShowDeleteModal(false);
          setContactToDelete(null);
          if (contacts.length === 1 && currentPage > 1) {
            dispatch(setPagination({ currentPage: currentPage - 1 }));
            dispatch(fetchContacts({ page: currentPage - 1, limit }));
          } else {
            dispatch(fetchContacts({ page: currentPage, limit }));
          }
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setServiceFilter("all");
    dispatch(fetchContacts({ page: currentPage, limit }));
  };

  const getMediaType = (item) => {
    const type = item?.type;
    if (typeof type === "string") {
      if (type.includes("/")) {
        const [prefix] = type.split("/");
        if (prefix === "video" || prefix === "image") {
          return prefix;
        }
      }
      const normalized = type.toLowerCase();
      if (normalized.includes("video")) return "video";
      if (normalized.includes("image")) return "image";
    }

    if (item?.url) {
      const urlLower = item.url.toLowerCase();
      if (urlLower.match(/\.(mp4|mov|avi|wmv|webm|mkv)(\?|$)/)) return "video";
      if (urlLower.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/)) return "image";
    }

    return "unknown";
  };

  const getFileExtension = (item) => {
    if (!item) return "";

    if (item.extension) {
      return item.extension.startsWith(".")
        ? item.extension.toLowerCase()
        : `.${item.extension.toLowerCase()}`;
    }

    if (item.mimeType) {
      const extensionFromMime = item.mimeType.split("/")[1];
      if (extensionFromMime) {
        return `.${extensionFromMime.toLowerCase()}`;
      }
    }

    if (item.type && item.type.includes("/")) {
      const extensionFromType = item.type.split("/")[1];
      if (extensionFromType) {
        return `.${extensionFromType.toLowerCase()}`;
      }
    }

    if (item.url) {
      const urlWithoutQuery = item.url.split("?")[0];
      const lastSegment = urlWithoutQuery.split("/").pop();
      if (lastSegment && lastSegment.includes(".")) {
        const ext = lastSegment.substring(lastSegment.lastIndexOf(".")).trim();
        if (ext) {
          return ext.toLowerCase();
        }
      }
    }

    const mediaType = getMediaType(item);
    if (mediaType === "video") return ".mp4";
    if (mediaType === "image") return ".jpg";

    return "";
  };

  const getFileNameFromItem = (item, index) => {
    if (!item) return `attachment-${index + 1}`;
    const potentialName =
      item.name || item.fileName || item.originalName || item.filename;

    if (potentialName) return potentialName;

    if (item.url) {
      try {
        const parsedUrl = new URL(item.url, window.location.origin);
        const pathname = parsedUrl.pathname || "";
        const extracted = pathname.substring(pathname.lastIndexOf("/") + 1);
        if (extracted) return extracted;
      } catch {
        const segments = item.url.split("/");
        const lastSegment = segments[segments.length - 1];
        if (lastSegment) {
          return lastSegment.split("?")[0];
        }
      }
    }

    const extension = getFileExtension(item) || ".dat";
    return `attachment-${index + 1}${extension}`;
  };

  const getDownloadUrl = (item) => {
    if (!item?.url) return null;

    if (item.url.includes("/upload/")) {
      return item.url.replace("/upload/", "/upload/fl_attachment/");
    }

    return item.url;
  };

  const handleDownloadMedia = async (item, index) => {
    if (!item?.url || typeof window === "undefined") return;

    try {
      const downloadUrl = getDownloadUrl(item);
      if (!downloadUrl) return;

      const response = await fetch(downloadUrl, {
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        headers: {
          Accept: "*/*",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to download attachment: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = getFileNameFromItem(item, index);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading attachment:", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getServiceLabel = (service) => {
    const option = SERVICE_OPTIONS.find((opt) => opt.value === service);
    return option ? option.label : service;
  };

  // Filter contacts based on search and service filter
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService =
      serviceFilter === "all" || contact.service === serviceFilter;

    return matchesSearch && matchesService;
  });

  const contactDetails = currentContact || selectedContact || {};
  const mediaItems = Array.isArray(contactDetails?.media)
    ? contactDetails.media
    : [];
  const hasCustomFields = [
    "designDescription",
    "preferredMetal",
    "preferredStone",
    "budget",
    "timeline",
    "size",
  ].some((field) => {
    const value = contactDetails?.[field];
    if (value === undefined || value === null) return false;
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return true;
  });

  if (loading && contacts.length === 0) {
    console.log("loading :", loading);
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
              Contact Inquiries
            </h1>
            <p className="font-montserrat-regular-400 text-black-light">
              Manage customer contact inquiries
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-montserrat-regular-400 text-black-light">
              Loading contacts...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
            Contact Inquiries
          </h1>
          <p className="font-montserrat-regular-400 text-black-light">
            Manage customer contact inquiries
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-montserrat-medium-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative col-span-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" w-full h-full pl-10 pr-4 py-2 border border-gray-300 outline-none rounded-lg focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>
          <div className="col-span-2">
            <CustomDropdown
              options={SERVICE_OPTIONS}
              value={serviceFilter}
              onChange={setServiceFilter}
              placeholder="Filter by service"
            />
          </div>
          {/* reset filters button */}
          <button
            onClick={handleResetFilters}
            className="col-span-1 flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-montserrat-medium-500 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredContacts?.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">
              No Contacts Found
            </h3>
            <p className="font-montserrat-regular-400 text-black-light">
              {searchTerm || serviceFilter !== "all"
                ? "No contacts match your filters"
                : "No contact inquiries yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-primary-light border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-montserrat-semibold-600 text-black whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-montserrat-medium-500 font-bold text-black">
                            {contact.name || "N/A"}
                          </h3>
                          <div className="flex flex-col space-y-1 mt-1">
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-xs text-primary hover:underline flex items-center space-x-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span>{contact.email || "N/A"}</span>
                            </a>
                            {contact.phone && (
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-xs text-black-light hover:underline flex items-center space-x-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{contact.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-xs font-montserrat-medium-500 rounded-full">
                        {getServiceLabel(contact.service || "general")}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm font-montserrat-regular-400 text-black-light line-clamp-2">
                        {contact.message || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-black-light" />
                        <span className="font-montserrat-regular-400 text-black text-sm">
                          {formatDate(contact.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewContact(contact)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Contact"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalRecords}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}

      {/* Contact View Modal */}
      {showContactModal &&
        selectedContact &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-sorts-mill-gloudy font-bold text-black">
                      Contact Details
                    </h2>
                    <p className="text-sm font-montserrat-regular-400 text-black-light">
                      Inquiry information
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-black-light" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-montserrat-regular-400 text-black-light">
                      Loading enquiry details...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {" "}
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-montserrat-medium-500 text-black-light mb-1">
                          Name
                        </label>
                        <div className="flex items-center space-x-2 text-black font-montserrat-medium-500">
                          <User className="w-4 h-4" />
                          <span>{contactDetails?.name || "N/A"}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-montserrat-medium-500 text-black-light mb-1">
                          Email
                        </label>
                        <a
                          href={`mailto:${contactDetails?.email || ""}`}
                          className="flex items-center space-x-2 text-primary hover:underline"
                        >
                          <Mail className="w-4 h-4" />
                          <span>{contactDetails?.email || "N/A"}</span>
                        </a>
                      </div>

                      {contactDetails?.phone ? (
                        <div>
                          <label className="block text-sm font-montserrat-medium-500 text-black-light mb-1">
                            Phone
                          </label>
                          <a
                            href={`tel:${contactDetails?.phone}`}
                            className="flex items-center space-x-2 text-black hover:underline"
                          >
                            <Phone className="w-4 h-4" />
                            <span>{contactDetails?.phone}</span>
                          </a>
                        </div>
                      ) : null}

                      <div>
                        <label className="block text-sm font-montserrat-medium-500 text-black-light mb-1">
                          Service
                        </label>
                        <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-xs font-montserrat-medium-500 rounded-full">
                          {getServiceLabel(
                            contactDetails?.service || "general"
                          )}
                        </span>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-montserrat-medium-500 text-black-light mb-1">
                          Date
                        </label>
                        <div className="flex items-center space-x-2 text-black">
                          <Calendar className="w-4 h-4 text-black-light" />
                          <span>{formatDate(contactDetails?.createdAt)}</span>
                        </div>
                      </div>

                      {contactDetails?.message ? (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-montserrat-medium-500 text-black-light mb-2">
                            Message
                          </label>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm font-montserrat-regular-400 text-black whitespace-pre-wrap">
                              {contactDetails?.message}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {contactDetails?.designDescription ? (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-montserrat-medium-500 text-black-light mb-2">
                            Design Description
                          </label>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm font-montserrat-regular-400 text-black whitespace-pre-wrap">
                              {contactDetails?.designDescription}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {hasCustomFields && (
                        <div className="md:col-span-2 space-y-4">
                          <h3 className="text-sm font-montserrat-semibold-600 text-black uppercase tracking-wide">
                            Custom Request Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contactDetails?.preferredMetal && (
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-xs font-montserrat-medium-500 text-black-light uppercase tracking-wide mb-1">
                                  Preferred Metal
                                </p>
                                <p className="text-sm font-montserrat-semibold-600 text-black">
                                  {contactDetails.preferredMetal}
                                </p>
                              </div>
                            )}
                            {contactDetails?.preferredStone && (
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-xs font-montserrat-medium-500 text-black-light uppercase tracking-wide mb-1">
                                  Preferred Stone
                                </p>
                                <p className="text-sm font-montserrat-semibold-600 text-black">
                                  {contactDetails.preferredStone}
                                </p>
                              </div>
                            )}
                            {contactDetails?.budget && (
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-xs font-montserrat-medium-500 text-black-light uppercase tracking-wide mb-1">
                                  Budget
                                </p>
                                <p className="text-sm font-montserrat-semibold-600 text-black">
                                  {contactDetails.budget}
                                </p>
                              </div>
                            )}
                            {contactDetails?.timeline && (
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-xs font-montserrat-medium-500 text-black-light uppercase tracking-wide mb-1">
                                  Timeline
                                </p>
                                <p className="text-sm font-montserrat-semibold-600 text-black">
                                  {contactDetails.timeline}
                                </p>
                              </div>
                            )}
                            {contactDetails?.size && (
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-xs font-montserrat-medium-500 text-black-light uppercase tracking-wide mb-1">
                                  Size
                                </p>
                                <p className="text-sm font-montserrat-semibold-600 text-black">
                                  {contactDetails.size}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {mediaItems.length > 0 && (
                        <div className="md:col-span-2 space-y-4">
                          <h3 className="text-sm font-montserrat-semibold-600 text-black uppercase tracking-wide">
                            Attachments
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {mediaItems.map((item, index) => {
                              const mediaType = getMediaType(item);
                              return (
                                <div
                                  key={`${item.url}-${index}`}
                                  className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                                >
                                  <span className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-montserrat-medium-500 rounded-full capitalize z-10">
                                    {mediaType}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadMedia(item, index)}
                                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition z-20"
                                    aria-label={`Download attachment ${index + 1}`}
                                  >
                                    <Download className="w-4 h-4 text-black" />
                                  </button>
                                  {mediaType === "video" ? (
                                    <video
                                      src={item.url}
                                      controls
                                      className="w-full h-48 object-cover bg-black"
                                    />
                                  ) : (
                                    <img
                                      src={item.url}
                                      alt={`Attachment ${index + 1}`}
                                      className="w-full h-48 object-cover"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                    <button
                      onClick={handleCloseModal}
                      className="px-5 py-2 border border-gray-300 rounded-lg text-black-light hover:bg-gray-50 transition-colors font-montserrat-medium-500"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body
        )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
        title="Delete Contact"
        message="Are you sure you want to delete this contact inquiry?"
        itemName={contactToDelete?.name}
        itemType="contact"
      />
    </div>
  );
};

export default Contacts;
