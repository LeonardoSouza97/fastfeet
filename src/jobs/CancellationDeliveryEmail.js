import { pt } from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import Mail from '../lib/Mail';

class DeliveryEmail {
  get key() {
    return 'CancellationDeliveryEmail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendEmail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Cancelamento de problema da entrega',
      template: 'cancellationDelivery',
      context: {
        recipient: delivery.recipient.name,
        product: delivery.product,
        deliveryMan: delivery.deliveryman.name,
        date: format(
          parseISO(delivery.canceled_at),
          "'Dia' dd 'de' MMMM', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new DeliveryEmail();
