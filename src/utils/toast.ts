import toast from "react-hot-toast";

type Locale = "es" | "en";
type CvName = "es" | "en";

type ShowCvDownloadToastArgs = {
  locale: Locale;
  cvName: CvName;
};

const getCvLabel = (locale: Locale, cvName: CvName) => {
  if (cvName === "en") {
    return locale === "en" ? "English CV" : "CV en inglés";
  }

  return locale === "en" ? "Spanish CV" : "CV en español";
};

export const showCvDownloadToast = ({
  locale,
  cvName,
}: ShowCvDownloadToastArgs) => {
  const cvLabel = getCvLabel(locale, cvName);
  toast.success(
    locale === "en"
      ? `Download started: ${cvLabel}`
      : `Descarga iniciada: ${cvLabel}`,
  );
};
