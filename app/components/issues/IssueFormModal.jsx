'use client';
import { useState } from 'react';
import { AlertTriangle, Zap, Clock, Target, Calendar, User, Plus, FileText } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Select from '../ui/Select';

export default function IssueFormModal({ isOpen, onClose, onSubmit, issue = null, isLoading }) {
  const [formData, setFormData] = useState({
    title: issue?.title || '',
    description: issue?.description || '',
    priority: issue?.priority || 'medium',
    type: issue?.type || 'short',
    status: issue?.status || 'open',
    createdBy: issue?.createdBy || 'current_user',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Created By is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onSubmit(formData);
      if (!issue) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          type: 'short',
          status: 'open',
          createdBy: 'current_user',
        });
      }
      setErrors({});
    } catch (error) {
      setErrors({ general: error.message || 'Failed to save issue' });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Clock className="w-4 h-4 text-slate-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'short' ? <Target className="w-4 h-4 text-amber-500" /> : <Calendar className="w-4 h-4 text-blue-500" />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={issue ? 'Edit Issue' : 'Create New Issue'}>
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">
                {issue ? 'Update Issue Details' : 'Document New Issue'}
              </h4>
              <p className="text-sm text-blue-700">
                {issue ? 'Modify the issue information below' : 'Capture challenges and opportunities for your team'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {errors.general && (
            <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Title */}
          <Input
            label="Issue Title"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="Enter a clear, descriptive title"
            required
            error={errors.title}
            icon={<FileText className="w-4 h-4 text-slate-400" />}
            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />

          {/* Description */}
          <Textarea
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Provide detailed context, impact, and any relevant background (optional)"
            rows={4}
            error={errors.description}
            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />

          {/* Priority and Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select
                label="Priority Level"
                value={formData.priority}
                onChange={handleChange('priority')}
                error={errors.priority}
                className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              >
                <option value="low">🟢 Low - Can be addressed later</option>
                <option value="medium">🟡 Medium - Standard priority</option>
                <option value="high">🟠 High - Needs prompt attention</option>
                <option value="critical">🔴 Critical - Urgent action required</option>
              </Select>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                {getPriorityIcon(formData.priority)}
                <span>
                  {formData.priority === 'critical' && 'Immediate action required'}
                  {formData.priority === 'high' && 'Should be addressed soon'}
                  {formData.priority === 'medium' && 'Standard workflow priority'}
                  {formData.priority === 'low' && 'Can be scheduled for later'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Select
                label="Issue Type"
                value={formData.type}
                onChange={handleChange('type')}
                error={errors.type}
                className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              >
                <option value="short">🎯 Short-term - Ready for action</option>
                <option value="long">📅 Long-term - Strategic planning</option>
              </Select>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                {getTypeIcon(formData.type)}
                <span>
                  {formData.type === 'short' && 'Can be converted to actionable tasks'}
                  {formData.type === 'long' && 'Requires strategic planning and resources'}
                </span>
              </div>
            </div>
          </div>

          {/* Created By */}
          <Input
            label="Created By"
            value={formData.createdBy}
            onChange={handleChange('createdBy')}
            placeholder="Your name or identifier"
            required
            error={errors.createdBy}
            icon={<User className="w-4 h-4 text-slate-400" />}
            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
          />

          {/* Action Buttons */}
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
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{issue ? 'Update Issue' : 'Create Issue'}</span>
                </div>
              )}
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
}