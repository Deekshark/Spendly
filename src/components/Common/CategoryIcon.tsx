import React from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  ShoppingCart,
  Car,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Plane,
  Sparkles,
  Package,
  QrCode,
  CreditCard,
  Landmark,
  Banknote,
  Building2,
  HelpCircle,
  Briefcase,
  Laptop,
  Store,
  TrendingUp,
  Gift,
  Coins,
  Wallet,
} from 'lucide-react';
import { CategoryId, IncomeCategoryId, PaymentMethod, IncomePaymentMethod } from '../../types/expense';
import { CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';

interface CategoryIconProps {
  category: CategoryId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBg?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 'md',
  className = '',
  showBg = true,
}) => {
  const cat = CATEGORIES[category] || CATEGORIES.other;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-full',
    md: 'w-10 h-10 rounded-full',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const renderIcon = () => {
    switch (category) {
      case 'food':
        return <UtensilsCrossed size={iconSizes[size]} />;
      case 'shopping':
        return <ShoppingBag size={iconSizes[size]} />;
      case 'groceries':
        return <ShoppingCart size={iconSizes[size]} />;
      case 'transport':
        return <Car size={iconSizes[size]} />;
      case 'bills':
        return <Receipt size={iconSizes[size]} />;
      case 'entertainment':
        return <Film size={iconSizes[size]} />;
      case 'health':
        return <HeartPulse size={iconSizes[size]} />;
      case 'education':
        return <GraduationCap size={iconSizes[size]} />;
      case 'travel':
        return <Plane size={iconSizes[size]} />;
      case 'personal':
        return <Sparkles size={iconSizes[size]} />;
      default:
        return <Package size={iconSizes[size]} />;
    }
  };

  if (!showBg) {
    return <span style={{ color: cat.color }}>{renderIcon()}</span>;
  }

  return (
    <div
      className={`flex items-center justify-center shrink-0 transition-transform ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: cat.bgColor,
        color: cat.color,
      }}
    >
      {renderIcon()}
    </div>
  );
};

interface IncomeCategoryIconProps {
  category: IncomeCategoryId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBg?: boolean;
}

export const IncomeCategoryIcon: React.FC<IncomeCategoryIconProps> = ({
  category,
  size = 'md',
  className = '',
  showBg = true,
}) => {
  const cat = INCOME_CATEGORIES[category] || INCOME_CATEGORIES.other;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-full',
    md: 'w-10 h-10 rounded-full',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const renderIcon = () => {
    switch (category) {
      case 'salary':
        return <Briefcase size={iconSizes[size]} />;
      case 'freelance':
        return <Laptop size={iconSizes[size]} />;
      case 'business':
        return <Store size={iconSizes[size]} />;
      case 'investments':
        return <TrendingUp size={iconSizes[size]} />;
      case 'gift':
        return <Gift size={iconSizes[size]} />;
      default:
        return <Coins size={iconSizes[size]} />;
    }
  };

  if (!showBg) {
    return <span style={{ color: cat.color }}>{renderIcon()}</span>;
  }

  return (
    <div
      className={`flex items-center justify-center shrink-0 transition-transform ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: cat.bgColor,
        color: cat.color,
      }}
    >
      {renderIcon()}
    </div>
  );
};

export const PaymentMethodIcon: React.FC<{
  method: PaymentMethod | IncomePaymentMethod;
  size?: number;
  className?: string;
}> = ({
  method,
  size = 14,
  className = '',
}) => {
  switch (method) {
    case 'UPI':
      return <QrCode size={size} className={className} />;
    case 'Credit Card':
    case 'Card':
      return <CreditCard size={size} className={className} />;
    case 'Debit Card':
      return <Landmark size={size} className={className} />;
    case 'Cash':
      return <Banknote size={size} className={className} />;
    case 'Bank Transfer':
    case 'Net Banking':
      return <Building2 size={size} className={className} />;
    default:
      return <HelpCircle size={size} className={className} />;
  }
};
