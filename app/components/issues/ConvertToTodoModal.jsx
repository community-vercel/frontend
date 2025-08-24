'use client';
import { useState } from 'react';
import { User, Calendar, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

export default function ConvertToTodoModal({ isOpen, onClose, onConvert, issue, isLoading }) {
  const [formData, setFormData] = useState({
    title: issue?.title || '',
    description: issue?.description || '',
    assignedTo: '',
    assignedBy: 'current_user',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assigned To is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onConvert({
        ...formData,
        originatingIssue: issue._id,
      });
    } catch (error) {
      setErrors({ general: error.message || 'Failed to convert issue to todo' });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const today = new Date();
  const minDate = today.toISOString().slice(0, 16);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convert Issue to Todo">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-blue-900 mb-1">Converting Issue:</h4>
              <p className="text-sm text-blue-700 font-medium truncate">{issue?.title}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                <span className="capitalize">Priority: {issue?.priority}</span>
                <span className="capitalize">Type: {issue?.type}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {errors.general && (
            <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="space-y-2">
            <Input
              label="Todo Title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="Enter the actionable task title"
              required
              error={errors.title}
              icon={<CheckCircle2 className="w-4 h-4 text-slate-400" />}
              className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Add any additional details or context..."
              rows={3}
              error={errors.description}
              className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
            <p className="text-xs text-slate-500">
              Original issue description will be referenced automatically
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="Assign To"
                value={formData.assignedTo}
                onChange={handleChange('assignedTo')}
                placeholder="Enter username or email"
                required
                error={errors.assignedTo}
                icon={<User className="w-4 h-4 text-slate-400" />}
                className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                label="Due Date"
                type="datetime-local"
                value={formData.dueDate}
                onChange={handleChange('dueDate')}
                min={minDate}
                required
                error={errors.dueDate}
                icon={<Calendar className="w-4 h-4 text-slate-400" />}
                className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Assigned by: {formData.assignedBy}</p>
                <p className="text-xs text-slate-500">This will be set automatically</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isLoading}
              className="flex-1 sm:flex-none border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Converting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Convert to Todo</span>
                </div>
              )}
            </Button>
          </div>
        </div>

       
      </div>
    </Modal>
  );
}