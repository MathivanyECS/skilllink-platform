interface Props {
  open: boolean;
  onClose: () => void;
}

const WishlistSuccessModal = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <h1 style={title}>Wishlist Added</h1>

        <p style={subtitle}>Skill added successfully</p>

        <div style={check}>✓</div>

        <button style={btn} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const box = {
  background: "#0f0f0f",
  padding: "48px 64px",
  borderRadius: 18,
  minWidth: 460,
  textAlign: "center" as const,
  color: "white",

  /* ✅ GREEN OUTLINE + GLOW */
  border: "2px solid #38AE56",
  boxShadow:
    "0 0 0 1px rgba(56,174,86,0.3), 0 30px 80px rgba(0,0,0,0.9)",

  /* ✅ ANIMATION */
  animation: "popup 0.35s ease-out"
};

const title = {
  margin: 0,
  marginBottom: 10,
  fontSize: 30,
  fontWeight: 700,
  letterSpacing: "0.5px"
};

const subtitle = {
  margin: 0,
  fontSize: 16,
  opacity: 0.75
};

const check = {
  fontSize: 64,
  margin: "26px 0",
  color: "#38AE56"
};

const btn = {
  background: "#38AE56",
  color: "#000",
  border: "none",
  padding: "12px 36px",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer"
};

/* ================= ANIMATION ================= */
/* NOTE: inline keyframes via style tag */
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes popup {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`;
document.head.appendChild(styleSheet);

export default WishlistSuccessModal;
