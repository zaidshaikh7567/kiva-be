import React from 'react';
import { ListChevronsDownUp } from 'lucide-react';
import Accordion from './Accordion';

const ProductDetailsSection = ({
  product,
  selectedMetal,
  selectedCarat,
  selectedRingSize,
  isRing = false,
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

    
  // Check if product is in bracelet category
  const isBracelet = product?.category?.name?.toLowerCase().includes('bracelet') || 
                     product?.category?.name?.toLowerCase().includes('bracelets') ||
                     false;

  const details = [
    {
      label: 'Material:',
      value: selectedMetal
        ? `${selectedMetal.carat} ${selectedMetal.color}`
        : 'Premium Gold/Silver',
      show: true,
    },
    {
  label: isRing?'Center Stone:':"Total Carat Weight",
  value: selectedCarat
    ? typeof selectedCarat === 'string'
      ? isRing
        ? selectedCarat
        : `${selectedCarat}`
      : isRing
        ? selectedCarat?.name
        : `${selectedCarat?.name}`
    : '',
    show:true,
  // show: Boolean(selectedCarat),
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
    {
      label: 'Length:',
      value: '7 in ',
      show: isBracelet,
    },
    {
      label: 'Width:',
      value: '2 carat (1.80 mm), 3 carat (2.10 mm), 4 carat (2.40 mm), 5 carat (2.80 mm), 6 carat (3.00 mm), 7 carat (3.40 mm), 10 carat (4.40 mm), 12 carat (5.30 mm), 15 carat (5.80 mm), 20 carat (6.20 mm)',
      show: isBracelet,
    },
    
  ];

  const containerClasses = ['space-y-3', className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">
        {detailsTitle}
      </h3>

      <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light ">
        {details
          .filter((detail) => detail.show && detail.value)
          .map((detail) => (
            <div 
              key={detail.label}
              className={detail.label === 'Width:' ? 'flex flex-row w-full ' : 'flex justify-between'}
            >
              <span className=" text-black font-montserrat-semibold-600">
                {detail.label}
              </span>
              {detail.label === 'Width:' ? (
                <div className="mt-1 space-y-1 w-full text-right">
                  {detail.value.split(', ').map((option, index) => (
                    <div key={index} className="text-black-light">
                      {option}
                    </div>
                  ))}
                </div>
              ) : (
                <span>{detail.value}</span>
              )}
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
              className="prose prose-sm max-w-none text-black-light font-montserrat-regular-400 [&_strong]:font-montserrat-semibold-600 [&_strong]:text-black [&_p]:mb-3 [&_p:last-child]:mb-0"
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


