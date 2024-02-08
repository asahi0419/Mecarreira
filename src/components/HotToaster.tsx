import toast, { ToastBar, Toaster } from 'react-hot-toast'
const HotToaster = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
        // Default options for specific types
        success: {
          duration: 1500,
          style: {
            border: '0px',
            padding: '16px',
            color: 'white',
            background: '#333',
          },
          iconTheme: {
            primary: 'green',
            secondary: 'white',
          },
        },
        error: {
          duration: 1000,
        },
      }}
    >
      {t => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {t.type !== 'loading' && (
                <span className="pointer" onClick={() => toast.dismiss(t.id)}>
                  {icon}
                </span>
              )}
              {message}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

export default HotToaster
