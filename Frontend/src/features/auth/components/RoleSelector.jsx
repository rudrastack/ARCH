import React from 'react';

/**
 * RoleSelector Component
 * High-fashion selectable cards for Buyer and Seller roles.
 */
export const RoleSelector = ({ selectedRole, onChange }) => {
  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Access curated haute couture and exclusive drops',
    },
    {
      id: 'seller',
      title: 'Seller',
      description: 'Showcase luxury pieces to global connoisseurs',
    },
  ];

  return (
    <div className="space-y-2 my-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium font-sans-editorial">
          Select Account Role
        </label>
        <span className="text-[10px] tracking-wider text-neutral-400 font-light">
          Required
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={`group relative text-left p-4 transition-all duration-300 border ${
                isSelected
                  ? 'border-black bg-neutral-900 text-white shadow-sm'
                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-semibold tracking-widest uppercase transition-colors ${
                    isSelected ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {role.title}
                </span>

                {/* Custom Minimalist Radio Indicator */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'border-white bg-white'
                      : 'border-neutral-300 group-hover:border-neutral-500'
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </div>
              </div>

              <p
                className={`text-[11px] leading-snug transition-colors line-clamp-2 ${
                  isSelected ? 'text-neutral-300 font-light' : 'text-neutral-500'
                }`}
              >
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
