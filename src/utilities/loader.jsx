import React from "react";

export function LoadingIndicator({ size = "3" }) {
  return (
    <div className="spinner-border text-primary" role="status" style={{ width: parseInt(size) * 10, height: parseInt(size) * 10 }}>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
