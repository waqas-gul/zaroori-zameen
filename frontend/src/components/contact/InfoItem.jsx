import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactInfoItem({ icon: Icon, title, content, link }) {
  const ContentWrapper = link ? 'a' : 'div';
  const props = link ? { href: link } : {};

  return (
    <ContentWrapper
      {...props}
      className={`flex items-start ${link ? 'hover:text-blue-600 transition-colors' : ''}`}
    >
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-gray-600">{content}</p>
      </div>
    </ContentWrapper>
  );
}