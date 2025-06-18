import React from "react";
import "./AuditHistory.css"
const ShowAuditHistory = ({ data, show, onHide }) => {
  if (!show) return null; 

  return (
    <div className="audit-modal">
      <div className="audit-content">
        <div className="audit_header">
          <h4>Audit History</h4>
          <button className="close-btn" onClick={onHide}>
            X
          </button>
        </div>

        {data && data.length > 0 ? (
          <table className="audit-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Operation</th>
                <th>User</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.featureName}</td>
                  <td>{item.operation}</td>
                  <td>{item.userName}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{new Date(item.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No audit history available.</p>
        )}
      </div>
    </div>
  );
};

export default ShowAuditHistory;
