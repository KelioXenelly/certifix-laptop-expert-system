import { Skeleton } from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

export default function LoadingDashboard() {
  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <Skeleton variant="text" width={300} height={40} className="mb-2" />
          <Skeleton variant="text" width={400} height={20} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <BuildOutlinedIcon />, color: 'sky' },
          { icon: <BugReportOutlinedIcon />, color: 'indigo' },
          { icon: <AccountTreeOutlinedIcon />, color: 'emerald' },
          { icon: <AssessmentOutlinedIcon />, color: 'purple' },
        ].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col w-full">
                <Skeleton variant="text" width={120} height={20} className="mb-2" />
                <Skeleton variant="text" width={60} height={40} />
              </div>
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-500 shrink-0`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Skeleton variant="text" width={250} height={32} className="mb-6" />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-64">
        <div className="bg-slate-50 border-b border-slate-200 h-12"></div>
        <div className="p-6">
          <Skeleton variant="rectangular" width="100%" height={40} className="mb-4 rounded-xl" />
          <Skeleton variant="rectangular" width="100%" height={40} className="mb-4 rounded-xl" />
          <Skeleton variant="rectangular" width="100%" height={40} className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}
