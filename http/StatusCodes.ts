/**
 * Standard HTTP status codes as defined in RFC 2616, RFC 6585, and RFC 7231
 * @see {@link https://tools.ietf.org/html/rfc2616#section-10}
 * @see {@link https://tools.ietf.org/html/rfc6585}
 * @see {@link https://tools.ietf.org/html/rfc7231#section-6}
 */
enum StatusCodes {
  // 1xx Informational
  /** The server has received the request headers and the client should proceed to send the request body. */
  CONTINUE = 100,

  /** The requester has asked the server to switch protocols and the server has agreed to do so. */
  SWITCHING_PROTOCOLS = 101,

  /** A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. */
  PROCESSING = 102,

  /** Used to return some response headers before final HTTP message. */
  EARLY_HINTS = 103,

  // 2xx Success
  /** Standard response for successful HTTP requests. */
  OK = 200,

  /** The request has been fulfilled, resulting in the creation of a new resource. */
  CREATED = 201,

  /** The request has been accepted for processing, but the processing has not been completed. */
  ACCEPTED = 202,

  /** The request has been fulfilled, but the response may contain outdated information. */
  NON_AUTHORITATIVE_INFORMATION = 203,

  /** The server successfully processed the request, but is not returning any content. */
  NO_CONTENT = 204,

  /** The server successfully processed the request, but is not returning any content and requires that the requester reset the document view. */
  RESET_CONTENT = 205,

  /** The server is delivering only part of the resource due to a range header sent by the client. */
  PARTIAL_CONTENT = 206,

  /** The message body that follows is an XML message and can contain a number of separate response codes. */
  MULTI_STATUS = 207,

  /** The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again. */
  ALREADY_REPORTED = 208,

  /** The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance. */
  IM_USED = 226,

  // 3xx Redirection
  /** Indicates multiple options for the resource from which the client may choose. */
  MULTIPLE_CHOICES = 300,

  /** This and all future requests should be directed to the given URI. */
  MOVED_PERMANENTLY = 301,

  /** The resource was found, but at a different URI. */
  FOUND = 302,

  /** The response to the request can be found under another URI using a GET method. */
  SEE_OTHER = 303,

  /** Indicates that the resource has not been modified since the version specified by the request headers. */
  NOT_MODIFIED = 304,

  /** The requested resource is only available through a proxy, the address for which is provided in the response. */
  USE_PROXY = 305,

  /** The request should be repeated with another URI, but future requests can still use the original URI. */
  TEMPORARY_REDIRECT = 307,

  /** The request and all future requests should be repeated using another URI. */
  PERMANENT_REDIRECT = 308,

  // 4xx Client Error
  /** The server cannot or will not process the request due to an apparent client error. */
  BAD_REQUEST = 400,

  /** Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. */
  UNAUTHORIZED = 401,

  /** Reserved for future use. */
  PAYMENT_REQUIRED = 402,

  /** The request was valid, but the server is refusing action. */
  FORBIDDEN = 403,

  /** The requested resource could not be found but may be available in the future. */
  NOT_FOUND = 404,

  /** A request method is not supported for the requested resource. */
  METHOD_NOT_ALLOWED = 405,

  /** The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request. */
  NOT_ACCEPTABLE = 406,

  /** The client must first authenticate itself with the proxy. */
  PROXY_AUTHENTICATION_REQUIRED = 407,

  /** The server timed out waiting for the request. */
  REQUEST_TIMEOUT = 408,

  /** Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates. */
  CONFLICT = 409,

  /** The requested resource is no longer available and will not be available again. */
  GONE = 410,

  /** The request did not specify the length of its content, which is required by the requested resource. */
  LENGTH_REQUIRED = 411,

  /** The server does not meet one of the preconditions that the requester put on the request. */
  PRECONDITION_FAILED = 412,

  /** The request is larger than the server is willing or able to process. */
  PAYLOAD_TOO_LARGE = 413,

  /** The URI provided was too long for the server to process. */
  URI_TOO_LONG = 414,

  /** The request entity has a media type which the server or resource does not support. */
  UNSUPPORTED_MEDIA_TYPE = 415,

  /** The client has asked for a portion of the file, but the server cannot supply that portion. */
  RANGE_NOT_SATISFIABLE = 416,

  /** The server cannot meet the requirements of the Expect request-header field. */
  EXPECTATION_FAILED = 417,

  /** This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. */
  IM_A_TEAPOT = 418,

  /** The request was directed at a server that is not able to produce a response. */
  MISDIRECTED_REQUEST = 421,

  /** The request was well-formed but was unable to be followed due to semantic errors. */
  UNPROCESSABLE_ENTITY = 422,

  /** The resource that is being accessed is locked. */
  LOCKED = 423,

  /** The request failed due to failure of a previous request. */
  FAILED_DEPENDENCY = 424,

  /** Indicates that the server is unwilling to risk processing a request that might be replayed. */
  TOO_EARLY = 425,

  /** The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field. */
  UPGRADE_REQUIRED = 426,

  /** The origin server requires the request to be conditional. */
  PRECONDITION_REQUIRED = 428,

  /** The user has sent too many requests in a given amount of time. */
  TOO_MANY_REQUESTS = 429,

  /** The server is unwilling to process the request because its header fields are too large. */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

  /** The server is denying access to the resource as a consequence of a legal demand. */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  // 5xx Server Error
  /** A generic error message, given when an unexpected condition was encountered and no more specific message is suitable. */
  INTERNAL_SERVER_ERROR = 500,

  /** The server either does not recognize the request method, or it lacks the ability to fulfill the request. */
  NOT_IMPLEMENTED = 501,

  /** The server was acting as a gateway or proxy and received an invalid response from the upstream server. */
  BAD_GATEWAY = 502,

  /** The server is currently unavailable (because it is overloaded or down for maintenance). */
  SERVICE_UNAVAILABLE = 503,

  /** The server was acting as a gateway or proxy and did not receive a timely response from the upstream server. */
  GATEWAY_TIMEOUT = 504,

  /** The server does not support the HTTP protocol version used in the request. */
  HTTP_VERSION_NOT_SUPPORTED = 505,

  /** Transparent content negotiation for the request results in a circular reference. */
  VARIANT_ALSO_NEGOTIATES = 506,

  /** The server is unable to store the representation needed to complete the request. */
  INSUFFICIENT_STORAGE = 507,

  /** The server detected an infinite loop while processing a request. */
  LOOP_DETECTED = 508,

  /** Further extensions to the request are required for the server to fulfill it. */
  NOT_EXTENDED = 510,

  /** The client needs to authenticate to gain network access. */
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

export default StatusCodes;