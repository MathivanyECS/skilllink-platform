interface Props {
  open: boolean;
  onClose: () => void;
}

const WishlistSuccessModal = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <h2>Wishlist Added Successfully</h2>
        <div style={check}>✓</div>

        <button style={btn} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000
};

const box = {
  background: "#38AE56",
  padding: "40px 60px",
  borderRadius: 16,
  color: "white",
  textAlign: "center" as const,
  minWidth: 420
};

const check = {
  fontSize: 60,
  margin: "20px 0"
};

const btn = {
  background: "white",
  color: "#38AE56",
  border: "none",
  padding: "10px 24px",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer"
};

export default WishlistSuccessModal;
