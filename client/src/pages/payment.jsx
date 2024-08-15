import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { toast } from 'react-toastify'

const Payment = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { showtime, selectedSeats } = location.state
	const [paymentMethod, setPaymentMethod] = useState('')
	const [cardNumber, setCardNumber] = useState('')
	const [expiryDate, setExpiryDate] = useState('')
	const [cvv, setCvv] = useState('')
	const [upiId, setUpiId] = useState('')

	const handleCardNumberChange = (e) => {
		let value = e.target.value.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
		setCardNumber(value);
	}

	const handleExpiryDateChange = (e) => {
		let value = e.target.value.replace(/\D/g, '');
		if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
		if (value.length > 5) value = value.slice(0, 5);
		if (value.length === 5 && parseInt(value.slice(0, 2), 10) > 12) {
			toast.error('Please enter a valid month (01-12)', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			});
		}
		setExpiryDate(value);
	}

	const handlePayment = (e) => {
		e.preventDefault()

		if (paymentMethod === 'creditCard' && !/^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber)) {
			toast.error('Please enter a valid card number', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			return
		}

		if (paymentMethod === 'creditCard' && !/^\d{2}\/\d{2}$/.test(expiryDate)) {
			toast.error('Please enter a valid expiry date', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			return
		}

		if (paymentMethod === 'upi' && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
			toast.error('Please enter a valid UPI ID', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			return
		}

		// Fake payment success
		toast.success('Payment successful!', {
			position: 'top-center',
			autoClose: 2000,
			pauseOnHover: false
		})
		navigate('/ticket', { state: { showtime, selectedSeats, paymentMethod } })
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-500 flex flex-col items-center py-10">
			<Navbar />
			<div className="bg-white p-12 rounded-lg shadow-lg mt-8 max-w-6xl w-full mx-auto">
				<h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Payment Options</h2>
				<form onSubmit={handlePayment} className="space-y-8">
					<div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
						<label className="block text-xl font-medium text-gray-700 mb-4 w-full text-center">Select Payment Method</label>
						<div className="flex flex-wrap justify-between w-full">
							<button
								type="button"
								className={`flex-1 p-6 rounded-lg border ${paymentMethod === 'creditCard' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} mr-2 text-xl text-center`}
								onClick={() => setPaymentMethod('creditCard')}
							>
								<span className="font-semibold">Credit Card</span>
							</button>
							<button
								type="button"
								className={`flex-1 p-6 rounded-lg border ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} ml-2 text-xl text-center`}
								onClick={() => setPaymentMethod('upi')}
							>
								<span className="font-semibold">UPI</span>
							</button>
						</div>
					</div>

					{paymentMethod === 'creditCard' && (
						<>
							<div className="mb-8">
								<label className="block text-xl font-medium text-gray-700 mb-4">Card Number</label>
								<input
									type="text"
									value={cardNumber}
									onChange={handleCardNumberChange}
									className="border p-6 rounded-lg w-full text-lg"
									placeholder="Enter 16-digit card number"
									maxLength={19} // 16 digits + 3 spaces
									required
								/>
							</div>

							<div className="mb-8">
								<label className="block text-xl font-medium text-gray-700 mb-4">Expiration Date</label>
								<input
									type="text"
									value={expiryDate}
									onChange={handleExpiryDateChange}
									className="border p-6 rounded-lg w-full text-lg"
									placeholder="MM/YY"
									maxLength={5}
									required
								/>
							</div>

							<div className="mb-8">
								<label className="block text-xl font-medium text-gray-700 mb-4">CVV</label>
								<input
									type="text"
									value={cvv}
									onChange={(e) => setCvv(e.target.value)}
									className="border p-6 rounded-lg w-full text-lg"
									placeholder="CVV"
									maxLength={3}
									required
								/>
							</div>
						</>
					)}

					{paymentMethod === 'upi' && (
						<div className="mb-8">
							<label className="block text-xl font-medium text-gray-700 mb-4">UPI ID</label>
							<input
								type="text"
								value={upiId}
								onChange={(e) => setUpiId(e.target.value)}
								className="border p-6 rounded-lg w-full text-lg"
								placeholder="Enter UPI ID"
								required
							/>
						</div>
					)}

					<button
						type="submit"
						className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition duration-300 w-full text-xl"
					>
						Complete Payment
					</button>
				</form>
			</div>
		</div>
	)
}

export default Payment
