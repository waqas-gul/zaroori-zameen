import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Backendurl } from "../App";
import { useDispatch } from "react-redux";
import { markQuestionnaireCompleted } from "../features/authSlice";

import Swal from "sweetalert2";

import {
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const Questionnaire = ({ onComplete, onCancel }) => {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Real estate specific questions
  const questions = [
    {
      id: "userType",
      question: "Are you looking to buy, sell, or rent property?",
      type: "radio",
      options: ["Buy", "Sell", "Rent"],
      icon: "🏠",
    },
    {
      id: "propertyTypes",
      question: "What types of properties are you interested in?",
      subtext: "Select all that apply",
      type: "checkbox",
      options: [
        "House",
        "Apartment",
        "Office",
        "Townhouse",
        "Land",
        "Commercial",
      ],
      icon: "🏢",
    },
    {
      id: "budget",
      question: "What is your approximate budget range?",
      type: "radio",
      options: [
        "Under PKR 10,00,000",
        "PKR 10,00,000 - PKR 25,00,000",
        "PKR 25,00,000 - PKR 50,00,000",
        "PKR 50,00,000 - PKR 1,00,00,000",
        "Over PKR 1,00,00,000",
      ],
      icon: "💵", // You can keep 💰 if preferred
    },
    {
      id: "bedrooms",
      question: "How many bedrooms are you looking for?",
      type: "radio",
      options: ["1", "2", "3", "4+", "Any"],
      icon: "🛏️",
    },
    {
      id: "locationPreferences",
      question: "Do you have specific location preferences?",
      type: "textarea",
      placeholder: "e.g., Near University Road, Peshawar...",
      icon: "🌎",
    },
    {
      id: "timeframe",
      question: "What is your timeframe for this real estate transaction?",
      type: "radio",
      options: [
        "Immediately",
        "Within 3 months",
        "Within 6 months",
        "Within a year",
      ],
      icon: "⏱️",
    },
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.post(
        `${Backendurl}/api/questionnaire/submit`,
        { answers },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(markQuestionnaireCompleted());

        // 🎉 Friendly Welcome Alert
        Swal.fire({
          title: "🎉 Welcome to Zaroro Zameen!",
          text: "Discover homes you’ll love. Let’s help you find your dream home.",
          imageUrl: "/zaroori-zameen-logo.png",
          imageWidth: 100,
          imageAlt: "App Logo",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            timerProgressBar: "custom-timer-bar",
          },
        }).then(() => {
          onComplete(); // Proceed after user clicks OK or timer ends
        });
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to submit questionnaire. Please try again.");

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    // Show confirmation dialog first
    const result = await Swal.fire({
      title: "Wait!",
      text: "Setting preferences helps us find your perfect property matches. Are you sure you want to skip?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, skip it",
      cancelButtonText: "No, continue",
      reverseButtons: true,
      backdrop: `
      rgba(0,0,0,0.5)
      url("/images/house-skipping.gif")
      left top
      no-repeat
    `,
      imageUrl: "/zaroori-zameen-logo.png",
      imageWidth: 80,
      imageAlt: "App Logo",
    });

    if (result.isConfirmed) {
      try {
        const authToken = localStorage.getItem("token");
        setIsSubmitting(true);
        setError(null);

        await axios.post(
          `${Backendurl}/api/questionnaire/skip`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        dispatch(markQuestionnaireCompleted());

        // Success message with similar style to submit
        Swal.fire({
          title: "Welcome to Zaroori Zameen!",
          text: "Discover homes you’ll love. Let’s help you find your dream home.",
          imageUrl: "/zaroori-zameen-logo.png",
          imageWidth: 100,
          imageAlt: "App Logo",
          showConfirmButton: false,
          timer: 3000, // disappears after 3 seconds
          timerProgressBar: true,
          customClass: {
            timerProgressBar: "custom-timer-bar",
          },
        }).then(() => {
          onCancel();
        });
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        setError("Failed to skip questionnaire. Please try again.");

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while skipping!",
          imageUrl: "/zaroori-zameen-logo.png",
          imageWidth: 100,
          imageAlt: "App Logo",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  const renderQuestionInput = (question) => {
    switch (question.type) {
      case "radio":
        return (
          <div className="space-y-3 mt-6">
            {question.options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.id}-${option}`}
                  name={question.id}
                  value={option}
                  onChange={() => handleAnswerChange(question.id, option)}
                  checked={answers[question.id] === option}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`${question.id}-${option}`}
                  className="ml-3 block text-gray-700 text-lg"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {question.options.map((option) => (
              <div
                key={option}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  answers[question.id]?.includes(option)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  const currentAnswers = answers[question.id] || [];
                  const newAnswers = currentAnswers.includes(option)
                    ? currentAnswers.filter((item) => item !== option)
                    : [...currentAnswers, option];
                  handleAnswerChange(question.id, newAnswers);
                }}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${question.id}-${option}`}
                    name={question.id}
                    value={option}
                    onChange={(e) => {
                      const currentAnswers = answers[question.id] || [];
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, option]
                        : currentAnswers.filter((item) => item !== option);
                      handleAnswerChange(question.id, newAnswers);
                    }}
                    checked={answers[question.id]?.includes(option) || false}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`${question.id}-${option}`}
                    className="ml-3 block text-gray-700 text-lg"
                  >
                    {option}
                  </label>
                </div>
              </div>
            ))}
          </div>
        );
      case "textarea":
        return (
          <div className="mt-6">
            <textarea
              id={question.id}
              name={question.id}
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-lg border border-gray-300 rounded-lg p-4"
              placeholder={question.placeholder}
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-100 hover:rotate-45 hover:scale-110 hover:opacity-80"
          aria-label="Close questionnaire"
        >
          <XMarkIcon className="h-6 w-6 text-gray-500 transition-transform duration-300 ease-in-out" />
        </button>

        <div className="p-8">
          {/* Progress bar */}
          <div className="my-7 ">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Question content */}
          <div className="mb-8">
            <div className="flex items-start mb-4">
              <span className="text-3xl mr-3">
                {questions[currentStep].icon}
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {questions[currentStep].question}
                </h3>
                {questions[currentStep].subtext && (
                  <p className="text-gray-500 mt-1">
                    {questions[currentStep].subtext}
                  </p>
                )}
              </div>
            </div>

            {renderQuestionInput(questions[currentStep])}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-5 py-3 rounded-lg ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!answers[questions[currentStep].id]}
                className={`flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                  !answers[questions[currentStep].id]
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !answers[questions[currentStep].id]}
                className={`flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                  isSubmitting || !answers[questions[currentStep].id]
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete
                    <CheckIcon className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
