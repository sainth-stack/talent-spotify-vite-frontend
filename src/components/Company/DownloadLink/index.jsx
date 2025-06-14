import React from 'react';
import "./styles.scss"

export default function DownloadLink({ text = "", link = "" }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="green-heading-link p-0 m-0">{text}</a>
  )
}
