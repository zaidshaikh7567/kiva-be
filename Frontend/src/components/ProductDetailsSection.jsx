import React from 'react';
import { ListChevronsDownUp } from 'lucide-react';
import Accordion from './Accordion';

const ProductDetailsSection = ({
  product,
  selectedMetal,
  selectedCarat,
  selectedRingSize,
  isRing = false,
  showCenterStone = isRing,
  showRingSize = isRing,
  className = '',
  descriptionHtml,
  detailsTitle = 'Product Details',
  accordionTitle = 'More Details',
}) => {
  if (!product) return null;

  const clarity = Array.isArray(product?.clarity)
    ? product.clarity.filter(Boolean)
    : [];
  const certificates = Array.isArray(product?.certificate)
    ? product.certificate.filter(Boolean)
    : [];

  const details = [
    {
      label: 'Material:',
      value: selectedMetal
        ? `${selectedMetal.carat} ${selectedMetal.color}`
        : 'Premium Gold/Silver',
      show: true,
    },
    {
      label: 'Center Stone:',
      value:
        typeof selectedCarat === 'string'
          ? selectedCarat
          : selectedCarat?.name,
      show: showCenterStone && Boolean(selectedCarat),
    },
    {
      label: 'Ring Size:',
      value: selectedRingSize,
      show: showRingSize && Boolean(selectedRingSize),
    },
    {
      label: 'Care:',
      value: product?.careInstruction,
      show: Boolean(product?.careInstruction),
    },
    {
      label: 'Shape:',
      value: product?.shape,
      show: Boolean(product?.shape),
    },
    {
      label: 'Color:',
      value: product?.color,
      show: Boolean(product?.color),
    },
    {
      label: 'Clarity:',
      value: clarity.join(', '),
      show: clarity.length > 0,
    },
    {
      label: 'Certificate:',
      value: certificates.join(', '),
      show: certificates.length > 0,
    },
  ];

  const containerClasses = ['space-y-3', className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">
        {detailsTitle}
      </h3>

      <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
        {details
          .filter((detail) => detail.show && detail.value)
          .map((detail) => (
            <div className="flex justify-between" key={detail.label}>
              <span className="font-montserrat-medium-500 text-black">
                {detail.label}
              </span>
              <span>{detail.value}</span>
            </div>
          ))}
      </div>

      {descriptionHtml && (
        <div className="space-y-2">
          <Accordion
            title={accordionTitle}
            icon={<ListChevronsDownUp className="w-4 h-4 text-primary" />}
          >
            <div
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            />
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsSection;


