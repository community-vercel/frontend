'use client';
import { useState, useEffect } from 'react';
import { User, Calendar, FileText, AlertCircle, Plus, Target } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { fetchIssues } from '../../lib/api';

export default function TodoFormModal({ isOpen, onClose, onSubmit, todo = null, isLoading, error }) {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    assignedTo: todo?.assignedTo || '',
    assignedBy: todo?.assignedBy || 'current_user',
    dueDate: todo?.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : '',
    originatingIssue: todo?.originatingIssue?._id || '',
  });
  const [errors, setErrors] = useState({});
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchIssuesData();
    }
  }, [isOpen]);

  const fetchIssuesData = async () => {
    try {
      const response = await fetchIssues({ status: 'open' });
      setIssues(response.data || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

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
    if (!formData.originatingIssue) {
      newErrors.originatingIssue = 'Originating Issue is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      if (!todo) {
        setFormData({
          title: '',
          description: '',
          assignedTo: '',
          assignedBy: 'current_user',
          dueDate: '',
          originatingIssue: '',
        });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to save todo' });
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
    <Modal isOpen={isOpen} onClose={onClose} title={todo ? 'Edit Task' : 'Create New Task'}>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-900">
                {todo ? 'Update Task Details' : 'Create Actionable Task'}
              </h4>
              <p className="text-sm text-emerald-700">
                {todo ? 'Modify the task information below' : 'Fill in the details for your new task'}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          {(errors.general || error) && (
            <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errors.general || error}</span>
            </div>
          )}
          <Input
            label="Task Title"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="Enter a clear, actionable task title"
            required
            error={errors.title}
            icon={<Target className="w-4 h-4 text-slate-400" />}
            className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Provide additional context or details (optional)"
            rows={3}
            error={errors.description}
            className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Assign To"
              value={formData.assignedTo}
              onChange={handleChange('assignedTo')}
              placeholder="Username or email"
              required
              error={errors.assignedTo}
              icon={<User className="w-4 h-4 text-slate-400" />}
              className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
            />
            <Input
              label="Assigned By"
              value={formData.assignedBy}
              onChange={handleChange('assignedBy')}
              placeholder="Your name"
              required
              error={errors.assignedBy}
              icon={<User className="w-4 h-4 text-slate-400" />}
              className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
            />
          </div>
          <Input
            label="Due Date"
            type="datetime-local"
            value={formData.dueDate}
            onChange={handleChange('dueDate')}
            min={minDate}
            required
            error={errors.dueDate}
            icon={<Calendar className="w-4 h-4 text-slate-400" />}
            className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
          />
          <div className="space-y-2">
            <Select
              label="Originating Issue"
              value={formData.originatingIssue}
              onChange={handleChange('originatingIssue')}
              required
              error={errors.originatingIssue}
              className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
            >
              <option value="">Select the source issue</option>
              {issues.map((issue) => (
                <option key={issue._id} value={issue._id}>
                  [{issue.type.toUpperCase()}] {issue.title}
                </option>
              ))}
            </Select>
           
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
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{todo ? 'Update Task' : 'Create Task'}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}