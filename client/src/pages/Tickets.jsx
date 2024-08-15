import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import ShowtimeDetails from '../components/ShowtimeDetails';
import { AuthContext } from '../context/AuthContext';

const Tickets = () => {
  const { auth } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [isFetchingTicketsDone, setIsFetchingTicketsDone] = useState(false);

  const fetchTickets = async () => {
    try {
      setIsFetchingTicketsDone(false);
      const response = await axios.get('/auth/tickets', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setTickets(
        response.data.data.tickets?.sort((a, b) => {
          if (a.showtime.showtime > b.showtime.showtime) {
            return 1;
          }
          return -1;
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingTicketsDone(true);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const generatePDF = (ticket) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Movie Ticket', 10, 10);

    // Add showtime details
    doc.setFontSize(14);
    doc.text(`Showtime: ${ticket.showtime.title || 'N/A'}`, 10, 20);
    doc.text(`Date and Time: ${ticket.showtime.showtime || 'N/A'}`, 10, 30);

    // Add seat details
    doc.text('Seats:', 10, 40);
    const seatDetails = ticket.seats.map(seat => `Row ${seat.row}, Seat ${seat.number}`).join(', ');
    doc.text(seatDetails || 'N/A', 10, 50);

    // Number of seats
    doc.text(`Number of Seats: ${ticket.seats.length || 0}`, 10, 60);

    // Additional ticket information if available
    if (ticket.id) {
      doc.text(`Ticket ID: ${ticket.id}`, 10, 70);
    }

    // Save the PDF
    doc.save('ticket.pdf');
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
      <Navbar />
      <div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
        <h2 className="text-3xl font-bold text-gray-900">My Tickets</h2>
        {isFetchingTicketsDone ? (
          <>
            {tickets.length === 0 ? (
              <p className="text-center">You have not purchased any tickets yet</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-[1920px]:grid-cols-3">
                {tickets.map((ticket, index) => (
                  <div className="flex flex-col" key={index}>
                    <ShowtimeDetails showtime={ticket.showtime} />
                    <div className="flex h-full flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
                      <div className="flex h-full flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
                        <p className="whitespace-nowrap font-semibold">Seats:</p>
                        <p className="text-left">
                          {ticket.seats.map((seat) => `Row ${seat.row}, Seat ${seat.number}`).join(', ')}
                        </p>
                        <p className="whitespace-nowrap">({ticket.seats.length} seats)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => generatePDF(ticket)}
                      className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                    >
                      Download Ticket
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Tickets;
