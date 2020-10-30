import BookingApi from '../api/booking';
import BookingService, { Booking, Preview } from './booking';
jest.mock('../api/booking');

describe('Booking test group', () => {

    test('BookingService should return instance of Booking object', async () => {
        //arrange
        (BookingApi.createBooking as any).mockResolvedValue({ sessionId: 'sessionId', hash: 'hash' });

        //act
        const booking = await BookingService.getInstanceAsync(1, 'token');

        //assert
        expect(booking).toEqual(
            expect.objectContaining({
                getContentAsync: expect.any(Function),
                saveAsync: expect.any(Function),
                getPreviewAsync: expect.any(Function),
                addCouponAsync: expect.any(Function),
                startPaymentAsync: expect.any(Function),
                finishPaymentAsync: expect.any(Function),
                cancelPaymentAsync: expect.any(Function),
                startLoggedUserInvoicePaymentAsync: expect.any(Function)
            }));
    })

    test('BookingService cache should work as well', async () => {
        //arrange
        (BookingApi.createBooking as any).mockResolvedValue({ sessionId: 'sessionId', hash: 'hash' });

        //act
        const booking = await BookingService.getInstanceAsync(1, 'token');
        const theSameBooking = await BookingService.getInstanceAsync(1, 'token');

        //assert
        expect(booking).toEqual(theSameBooking);
    })

    test('Booking should update preview if it is empty and not forced', async () => {
        //arrange
        (BookingApi.getPrintPreview as any).mockClear();
        (BookingApi.getPrintPreview as any).mockResolvedValue({ imageUrl: 'imageUrl', publishTimes: [], valid: true });
        let booking = new (Booking as any)({});

        //act
        let preview = await booking.getPreviewAsync();

        //assert
        expect((BookingApi.getPrintPreview as any).mock.calls.length).toEqual(1);
        expect(preview.getImageUrl()).toEqual('imageUrl');
    })

    test('Booking should not update preview if it is not empty and NOT forced', async () => {
        //arrange
        (BookingApi.getPrintPreview as any).mockClear();
        const previewResponce = { imageUrl: 'imageUrl', publishTimes: [], valid: true };
        let booking = new (Booking as any)({ preview: previewResponce });

        //act
        let preview = await booking.getPreviewAsync();

        //assert
        expect((BookingApi.getPrintPreview as any).mock.calls.length).toEqual(0);
        expect(preview.getImageUrl()).toEqual('imageUrl');
    })

    test('Booking should update preview if it is not empty and FORCED', async () => {
        //arrange
        (BookingApi.getPrintPreview as any).mockClear();
        const oldPreviewResponce = { imageUrl: 'imageUrl', publishTimes: [], valid: true };
        (BookingApi.getPrintPreview as any).mockResolvedValue({ imageUrl: 'imageUrl_1', publishTimes: [], valid: true });
        let booking = new (Booking as any)({ preview: oldPreviewResponce });

        //act
        const forced = true;
        let preview = await booking.getPreviewAsync(forced);

        //assert
        expect((BookingApi.getPrintPreview as any).mock.calls.length).toEqual(1);
        expect(preview.getImageUrl()).toEqual('imageUrl_1');
    })

    test('Preview with empty publishTime of initialization data should have empty list of publishTimes', () => {
        //arrange
        let preview = new (Preview as any)();

        //act & assert
        expect(preview.getPublishTimes()).toEqual([]);
    })

    test('Preview should return publishedTimes with additional fields: id, name', () => {
        //arrange
        let publishTimes = [{
            days: 1,
            price: 100,
            publishTimeText: "100 kr 1 dag i tidningen utan bild",
            totalPriceText: "Totalpris 100 SEK",
            vat: 20,
            vatText: "Varav moms 20 SEK",
            withPic: false
        }];
        let preview = new (Preview as any)({ publishTimes });

        //act & assert
        expect(preview.getPublishTimes().length).toEqual(1);
        expect(Object.keys(preview.getPublishTimes()[0])).toEqual(expect.arrayContaining(['id', 'name']));
    })

    test('Preview should return publishedTimes with additional fields: id, name', () => {
        //arrange
        let publishTimes = [{
            days: 1,
            price: 100,
            publishTimeText: "100 kr 1 dag i tidningen utan bild",
            totalPriceText: "Totalpris 100 SEK",
            vat: 20,
            vatText: "Varav moms 20 SEK",
            withPic: false
        },
        {
            days: 2,
            price: 200,
            publishTimeText: "200 kr 2 dagar i tidningen utan bild",
            totalPriceText: "Totalpris 200 SEK",
            vat: 40,
            vatText: "Varav moms 40 SEK",
            withPic: false,
        },
        {
            days: 3,
            price: 300,
            publishTimeText: "300 kr 3 dagar i tidningen utan bild",
            totalPriceText: "Totalpris 300 SEK",
            vat: 60,
            vatText: "Varav moms 60 SEK",
            withPic: false
        }];
        let preview = new (Preview as any)({ publishTimes });

        const id = "200 kr 2 dagar i tidningen utan bild";

        //act
        let foundPublishTime = preview.getPublishTimeById(id);

        //assert
        expect(foundPublishTime.id).toEqual(id);
    })

})